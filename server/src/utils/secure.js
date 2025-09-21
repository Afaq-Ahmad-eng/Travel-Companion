//We have the encryptData and decryptData functions in both the server (backend) folder and the travel-companion (frontend) folder, but this is not the recommended way.

//External library for AES encryption
import CryptoJS from "crypto-js";



//Function to encrypt password using AES encryption
export const encryptData = (plainData) => {
  const secretKey = SECRET_KEY;
  return CryptoJS.AES.encrypt(plainData, secretKey).toString();
};

//Function to decrypt data
export const decryptData = (encryptedData) => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}