// auth.controller.js
import {
  createUsers,
  getUserByEmail,
  createRefreshToken,
  updateUserUpdatedAtField,
  updatePassword
} from "./auth.service.js";
import { validateRegister, validateLogin } from "./auth.validator.js";
import { hashPassword, verifyPassword } from "../../utils/hashing.js";

import { decryptData, encryptData } from "../../utils/secure.js";
import { setAccessToken, setRefreshToken } from "../../utils/cookies.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from "../../utils/tokens.js";

import {
  validateAdminRegister,
  validateAdminLogin,
} from "../admin/admin.validator.js";

import {
  getAdminByEmail,
  updateAdminUpdatedAtField,
  createAdminRefreshToken,
  createAdmin
} from "../admin/admin.service.js";

import dotenv from "dotenv";
// Load environment variables from .env file
dotenv.config();

// Register
export const register = async (req, res) => {
  const { username, email, password, phoneNumber, location } =
    req.body;

  // create a new object for decrypted data come from frontend
  let decryptedDataComeEncryptedFromFrontend;
  try {
    decryptedDataComeEncryptedFromFrontend = {
      user_name: decryptData(username),
      user_email: decryptData(email),
      user_phoneno: decryptData(phoneNumber),
      user_password: decryptData(password),
      user_location: decryptData(location),
    };
  } catch (err) {
    res.send({ message: err });
  }
  // validate request body
  try {
    validateRegister(decryptedDataComeEncryptedFromFrontend);
  } catch (error) {
    res.status(400).json({ message: error.details[0].message });
  }
  // hash the password
  let hashedPassword;
  try {
    hashedPassword = await hashPassword(
      decryptedDataComeEncryptedFromFrontend.user_password
    );
  } catch (error) {
    console.log("Error while hashing password: ", error);
    return res.status(500).json({
      message: "Internal server error while processing password",
      Error: error
    });
  }

  // Encrypt the phone number before storing`
  const encryptedPhoneNumber = encryptData(
    decryptedDataComeEncryptedFromFrontend.user_phoneno
  );

  // prepare data for creating user
  const data = {
    user_name: decryptedDataComeEncryptedFromFrontend.user_name,
    user_email: decryptedDataComeEncryptedFromFrontend.user_email,
    user_location: decryptedDataComeEncryptedFromFrontend.user_location,
    user_phoneno: encryptedPhoneNumber,
    user_password: hashedPassword,
  };
  
  try {
    //Save Data into DB in user table
    const user = await createUsers(data);

    res.status(201).json({
      message: "your are registered successfully",
      response: { username: user.user_name },
      adminRegisteration: false
    });
    //if there is any error in the creation of the user data fro registration
  } catch (err) {
    res.status(err.status || 500).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  }
};

// Login
export const login = async (req, res) => {
  const { user_email, user_password } = req.body;
  let checkPassword;
  let decncryptedData;
  
  const errorStatusAndMessage = {
    success: false,
    message:
    "Invalid credentials, dear user your passsword or email are wrong!",
  };
  
  decncryptedData = {
    user_email: decryptData(user_email),
    user_password: decryptData(user_password),
  };
  
  try {
    const { error } = validateLogin(decncryptedData);
    if (error)
      return res.status(400).json({ message: error.details[0].message, isUserRegister: false, });
  } catch (validationError) {
    return res.status(400).json({
      success: false,
      isUserRegister: false,
      message: validationError.details?.[0]?.message || "Validation failed",
    });
  }

  try {
    const userFortoUpDateUserUpdatedAtField = await getUserByEmail(
      decncryptedData.user_email
    );

    if (!userFortoUpDateUserUpdatedAtField) {
      return res.status(401).json({
        success: false,
        isUserRegister: false,
        message: "Dear user, you haven’t registered with us yet. Please register first to continue.",
      });
    }

    checkPassword = await verifyPassword(
      decncryptedData.user_password,
      userFortoUpDateUserUpdatedAtField.user_password
    );

    if (!checkPassword) {
      return res.status(401).json(errorStatusAndMessage);
    }

    const user = await updateUserUpdatedAtField(
      userFortoUpDateUserUpdatedAtField.user_id
    );

    //Setting data for jwt token
    const jwtPayload = {
      user_id: user.user_id,
      user_email: decncryptedData.user_email,
    };

    //Generate refresh and access token
    const userRefreshToken = generateRefreshToken(jwtPayload);
    const userAccessToken = generateAccessToken(jwtPayload);

    //Here we encrypt both refresh and access token
    const encryptRefreshToken = encryptData(userRefreshToken);
    const encryptAccessToken = encryptData(userAccessToken);

    //Store refresh token in the DB for verification purpose
    await createRefreshToken(jwtPayload.user_id, encryptRefreshToken);

    // Send access token in HttpOnly cookie
    setAccessToken(res,"user_accessToken", encryptAccessToken);

    // Send refresh token in HttpOnly cookie
    setRefreshToken(res,"user_refreshToken", encryptRefreshToken);

    return res.status(200).json({
      message: "Login successful",
      userLogin: true,
      user: {
        user_id: user.user_id,
        user_name: user.user_name,
        user_email: user.user_email,
        user_updatedAt: user.user_updatedAt,
        user_status: user.user_status,
      },
    });
  } catch (error) {
    console.log(error);
    
    return res.status(error.status || 500).json({
      status: error.status,
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export const renewAccessToken = (req, res) => {
  try {
    // 1. Get refresh token from cookies
    const refreshToken = decryptData(req.cookies.user_refresh_token);
    if (!refreshToken) {
      return res.status(401).json({ message: "Please login" });
    }

    // 2. Verify refresh token
    const { valid, expired, decodedUser } = verifyToken(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    if (!valid || expired) {
      return res.status(403).json({ message: "Please login again." });
    }

    // 3. Generate new access token
    const newAccessToken = generateAccessToken(decodedUser.email);

    // Set the newAccessToken in the cookie but encrypted

    setAccessToken(res, "user_accessToken",encryptData(newAccessToken));

    // 4. Send new access token back
    return res.status(200).json({
      message: "New access token generated",
      newAccessToken,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};


//adminLogin controller
export const adminLogin = async (req, res, next) => {
  const { user_email, user_password } = req.body;
  let decryptedData;

  const errorStatusAndMessage = {
    success: false,
    message:
      "Invalid credentials, dear admin your email or password are incorrect!",
  };

  try {
    decryptedData = {
      user_email: decryptData(user_email),
      user_password: decryptData(user_password),
    };
  } catch (decryptionError) {
    return res.status(400).json({
      success: false,
      message: "Invalid encrypted data",
    });
  }

  //Validate input format
  try {
    const { error } = validateAdminLogin(decryptedData);
    if (error)
      return res.status(400).json({
        success: false,
        isUserRegister: false,
        message: error.details[0].message,
      });
  } catch (validationError) {
    return res.status(400).json({
      success: false,
      isUserRegister: false,
      message: validationError.details?.[0]?.message || "Validation failed",
    });
  }

  try {
    //Fetch admin from DB
    const admin = await getAdminByEmail(decryptedData.user_email);

    if (!admin) {
      return res.status(401).json({
        success: false,
        isUserRegister: false,
        message:
          "You are not register with us!. Thank you",
      });
    }

    //Verify password
    const passwordMatch = await verifyPassword(
      decryptedData.user_password,
      admin.admin_password
    );

    if (!passwordMatch) return res.status(401).json(errorStatusAndMessage);

    //Update last login field
    const updatedAdmin = await updateAdminUpdatedAtField(admin.admin_id);
    //JWT token payload
    const jwtPayload = {
      admin_id: updatedAdmin.admin_id,
      admin_email: updatedAdmin.admin_email,
      admin_role: updatedAdmin.role,
    };

    //Generate tokens
    const refreshToken = generateRefreshToken(jwtPayload);
    const accessToken = generateAccessToken(jwtPayload);

    //Encrypt tokens
    const encryptRefreshToken = encryptData(refreshToken);
    const encryptAccessToken = encryptData(accessToken);

    //Store refresh token in DB
   const response =  await createAdminRefreshToken(updatedAdmin.admin_id, encryptRefreshToken);

    //Send tokens in cookies
    setAccessToken(res, "admin_accessToken",encryptAccessToken);
    setRefreshToken(res, "admin_refreshToken",encryptRefreshToken);

    //Final response
    return res.status(200).json({
      message: "Admin login successful",
      adminLoginSuccessful: true,
      user: {
        admin_id: updatedAdmin.admin_id,
        admin_name: updatedAdmin.admin_name,
        admin_email: updatedAdmin.admin_email,
        admin_updatedAt: updatedAdmin.admin_updatedAt,
      },
    });
  } catch (error) {
    console.log("Admin login error:", error);

    return res.status(error.status || 500).json({
      status: error.status,
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

//AdminRegister controller
export const adminRegister = async (req, res, next) => {
  const { username, email, password, phoneNumber, location } = req.body;
  // role → should be either 'user' or 'admin' (frontend should send this)

  let decryptedData;
  try {
    decryptedData = {
      name: decryptData(username),
      email: decryptData(email),
      phone: decryptData(phoneNumber),
      password: decryptData(password),
      location: decryptData(location),
      role: "admin",
    };
  } catch (err) {
    return res
      .status(400)
      .json({ message: "Decryption failed: " + err.message });
  }

  // Validate the decrypted data
  try {
    validateAdminRegister(decryptedData);
  } catch (error) {
    console.log("We get error of the admin register ", error);

    return res.status(400).json({ message: error.details[0].message });
  }

  //Hash password
  let hashedPassword;
  try {
    hashedPassword = await hashPassword(decryptedData.password);
  } catch (error) {
    console.log("we get the error ", error);

    return res.status(500).json({ message: "Internal error hashing password" });
  }

  // Encrypt phone number before saving
  const encryptedPhone = encryptData(decryptedData.phone);

  //Prepare data for DB
  const commonData = {
    name: decryptedData.name,
    email: decryptedData.email,
    phone_no: encryptedPhone,
    location: decryptedData.location,
    password: hashedPassword,
  };

  try {
    let response;
    if (decryptedData.role === "admin") {
      //Save into Admin table
      response = await createAdmin({
        admin_name: commonData.name,
        admin_email: commonData.email,
        admin_phoneno: commonData.phone_no,
        admin_location: commonData.location,
        admin_password: commonData.password,
      });
    } else {
      // Save into User table
      response = await createUsers({
        user_name: commonData.name,
        user_email: commonData.email,
        user_phoneno: commonData.phone_no,
        user_location: commonData.location,
        user_password: commonData.password,
      });
    }

    res.status(201).json({
      success: true,
      message: `${decryptedData.role} registered successfully`,
      response: { username: commonData.name },
      adminRegisteration: true
    });
  } catch (err) {
    console.log("We are the last try catch block ", err);

    res.status(err.status || 500).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  }
};


export const checkTokenAndShowTheLogout = (req, res) => {
  try {
    const accessToken = req.cookies.user_accessToken;
    const refreshToken =  req.cookies.user_refreshToken;

    if (!accessToken || !refreshToken) {
      return res.status(200).json({
        message: "We reach to the login check endpoint ", 
        loggedIn: false 
      });
    }else{
    return res.status(200).json({ loggedIn: true });
    }
  } catch (error) {
    return res.status(500).json({
      loggedIn: false,
      message: "Server error while checking login status"
    });
  }
};

//controller for the password forget
export const forgetPassword = async (req, res) => {
  try{
    const newPasswordHash = await hashPassword(req.body.password);
   
   await updatePassword(req.body.email, newPasswordHash);
    
      res.status(200).json({
        success: true,
        message: "Passwrod has updated successfully!"
      })
  }catch(forgetPasswordError){
    console.log("we get error during the forgetPasswordError ", forgetPasswordError);
  }
}