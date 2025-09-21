//We have the encryptData and decryptData functions in both the server (backend) folder and the travel-companion (frontend) folder, but this is not the recommended way.

//External library for AES encryption
import CryptoJS from "crypto-js";
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

//Function to encrypt password using AES encryption
export const encryptData = (plainData) => {
  return CryptoJS.AES.encrypt(plainData, process.env.ENCRYPTION_AND_DECRYPTION_SECRET_KEY).toString();
};

//Function to decrypt data
export const decryptData = (encryptedData) => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, process.env.ENCRYPTION_AND_DECRYPTION_SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}