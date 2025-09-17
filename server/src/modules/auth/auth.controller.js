// auth.controller.js
import {
  createUsers,
  getUserByEmail,
  getAllUsers,
} from "../user/user.service.js";
import { validateRegister, validateLogin } from "./auth.validator.js";
import { hashPassword, verifyPassword } from "../../utils/hashing.js";

import { decryptData, encryptData } from "../../utils/secure.js";
import e from "express";

// Register
export const register = async (req, res) => {
  const { username, email, password, phoneNumber } = req.body;

  let decryptedUsername,
    decryptedEmail,
    decryptedPassword,
    decryptedPhoneNumber;

  decryptedUsername = decryptData(username);
  decryptedEmail = decryptData(email);
  decryptedPassword = decryptData(password);
  decryptedPhoneNumber = decryptData(phoneNumber);

  // create a new object for decrypted data come from frontend
  const decryptedDataComeEncryptedFromFrontend = {
    user_name: decryptedUsername,
    user_email: decryptedEmail,
    user_phoneno: decryptedPhoneNumber,
    user_password: decryptedPassword,
  };

  // validate request body
  const { error } = validateRegister(decryptedDataComeEncryptedFromFrontend);
  if (error) return res.status(400).json({ message: error.details[0].message });

  // hash the password
  const hashedPassword = await hashPassword(
    decryptedDataComeEncryptedFromFrontend.user_password
  );

  // Encrypt the phone number before storing`
  const encryptedPhoneNumber = encryptData(
    decryptedDataComeEncryptedFromFrontend.user_phoneno
  );
  console.log(
    "Encrypted Phone Number after decryption: ",
    encryptedPhoneNumber
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
    res.status(201).json({ message: "User registered successfully", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Login
export const login = async (req, res) => {
  try {
    
    const { user_email, user_password } = req.body;

    console.log("Reached at login function user email  : ", user_email);
    console.log("Reached at login function user password : ", user_password);
    
    const { error } = validateLogin(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const response = await getUserByEmail(user_email);
    console.log("User fetched by email: ", response);

    if (response) {
        console.log("User found with email: ", user_email);
        res.status(200).json({ message: "Login successful", response });
    }else{
        res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};
