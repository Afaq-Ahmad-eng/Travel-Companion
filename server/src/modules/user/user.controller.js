// External modules
import CryptoJS from "crypto-js";

// src/modules/user/user.controller.js
import {createUsers, getUserByEmail, getAllUsers} from "./user.service.js";




const decncryptedData = (encryptedData) => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}

export const createUser = async (req, res) => {
  try {
    console.log("📥 This data is come from the controller: " , req.body);


    const decryptedUsername = decncryptedData(req.body.username);
    const decryptedEmail = decncryptedData(req.body.email);
    const decryptedPassword = decncryptedData(req.body.password);
    const decryptedPhoneNumber = decncryptedData(req.body.phoneNumber);

    const data = {
      user_name: decryptedUsername,
      user_email: decryptedEmail,
      user_phoneno: decryptedPhoneNumber,
      user_password: decryptedPassword
    };
    
   
    const user = await createUsers(data);
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
