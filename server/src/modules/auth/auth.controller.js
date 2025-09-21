// auth.controller.js
import {
  createUsers,
  getUserByEmail,
  getAllUsers,
} from "../user/user.service.js";
import { validateRegister, validateLogin } from "./auth.validator.js";
import { hashPassword, verifyPassword } from "../../utils/hashing.js";

import { decryptData, encryptData } from "../../utils/secure.js";

// Register
export const register = async (req, res) => {
  const { username, email, password, phoneNumber } = req.body;

  // create a new object for decrypted data come from frontend
  let decryptedDataComeEncryptedFromFrontend;
  try {
    decryptedDataComeEncryptedFromFrontend = {
      user_name: decryptData(username),
      user_email: decryptData(email),
      user_phoneno: decryptData(phoneNumber),
      user_password: decryptData(password),
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
    user_phoneno: encryptedPhoneNumber,
    user_password: hashedPassword,
  };
  try {
    const user = await createUsers(data);
    
      res.status(201).json({
      message: "your are registered successfully",
      response: { username: user.user_name },
    });
  } catch (err) {
    res.status(err.status || 500).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { user_email, user_password } = req.body;

    console.log("Reached at login function user email  : ", user_email);
    console.log("Reached at login function user password : ", user_password);

    const { error } = validateLogin(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const response = await getUserByEmail(user_email);
    console.log("User fetched by email: ", response);

    if (response) {
      console.log("User found with email: ", user_email);
      res.status(200).json({ message: "Login successful", response });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};
