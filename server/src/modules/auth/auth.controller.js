// auth.controller.js
import { createUsers, getUserByEmail, createRefreshToken, updateUserUpdatedAtField } from "./auth.service.js";
import { validateRegister, validateLogin } from "./auth.validator.js";
import { hashPassword, verifyPassword } from "../../utils/hashing.js";

import { decryptData, encryptData } from "../../utils/secure.js";
import { setAccessToken, setRefreshToken } from "../../utils/cookies.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from "../../utils/tokens.js";

import dotenv from "dotenv";
// Load environment variables from .env file
dotenv.config();

// Register
export const register = async (req, res) => {
  const { username, email, password, phoneNumber, interest, location } =
    req.body;

  // create a new object for decrypted data come from frontend
  let decryptedDataComeEncryptedFromFrontend;
  try {
    decryptedDataComeEncryptedFromFrontend = {
      user_name: decryptData(username),
      user_email: decryptData(email),
      user_phoneno: decryptData(phoneNumber),
      user_password: decryptData(password),
      user_interest: decryptData(interest),
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
    return res.status(500).json({
      message: "Internal server error while processing password",
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
    user_interest: decryptedDataComeEncryptedFromFrontend.user_interest,
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

  try {
    decncryptedData = {
      user_email: decryptData(user_email),
      user_password: decryptData(user_password),
    };
  } catch (decryptionError) {
    return res.status(400).json({
      success: false,
      message: "Invalid encrypted data",
    });
  }
  try {
    const { error } = validateLogin(decncryptedData);
    if (error)
      return res.status(400).json({ message: error.details[0].message });
  } catch (validationError) {
    return res.status(400).json({
      success: false,
      message: validationError.details?.[0]?.message || "Validation failed",
    });
  }

  try {
    const userFortoUpDateUserUpdatedAtField = await getUserByEmail(decncryptedData.user_email);
    
    if (!userFortoUpDateUserUpdatedAtField) {
      return res.status(401).json(errorStatusAndMessage);
    }
    
    checkPassword = await verifyPassword(
      decncryptedData.user_password,
     userFortoUpDateUserUpdatedAtField.user_password
    );
    
    if (!checkPassword) {
      return res.status(401).json(errorStatusAndMessage);
    }
    
   const user = await updateUserUpdatedAtField(userFortoUpDateUserUpdatedAtField.user_id);

    //Setting data for jwt token
    const jwtPayload = {
      user_id: user.user_id,
      user_email: decncryptedData.user_email,
    };
     
    //Generate refresh and access token
    const refreshToken = generateRefreshToken(jwtPayload);
    const accessToken = generateAccessToken(jwtPayload);
  
    //Here we encrypt both refresh and access token
    const encryptRefreshToken = encryptData(refreshToken);
    const encryptAccessToken = encryptData(accessToken);
     
    //Store refresh token in the DB for verification purpose 
    await createRefreshToken(jwtPayload.user_id,encryptRefreshToken);

    // Send access token in HttpOnly cookie
    setAccessToken(res, encryptAccessToken);

    // Send refresh token in HttpOnly cookie
    setRefreshToken(res, encryptRefreshToken);

    return res.status(200).json({
      message: "Login successful",
      user: {
        user_id: user.user_id,
        user_name: user.user_name,
        user_email: user.user_email,
        user_updatedAt: user.user_updatedAt,
        user_status: user.user_status,
        user_role: user.user_role
      },
    });
  } catch (error) {
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
    const refreshToken = decryptData(req.cookies.refreshToken);
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

    setAccessToken(res, encryptData(newAccessToken));

    // 4. Send new access token back
    return res.status(200).json({
      message: "New access token generated",
      newAccessToken,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
