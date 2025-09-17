// External library ASE using for decryption
import CryptoJS from "crypto-js";

import dotenv from "dotenv";
dotenv.config();

//Decrypting the encrypted data (coming from frontend) using AES decryption 
export const decryptData = (encryptedData) => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, process.env.ENCRYPTION_AND_DECRYPTION_SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}

//Encrypting the plain phoneno using AES encryption
export const encryptData = (plainPhoneNo ) => {
  const secretKey = process.env.ENCRYPTION_AND_DECRYPTION_SECRET_KEY;
  return CryptoJS.AES.encrypt(plainPhoneNo, secretKey).toString();
};