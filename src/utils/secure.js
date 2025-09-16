//External library for AES encryption
import CryptoJS from "crypto-js";

//Secret key for AES encryption
const SECRET_KEY= "642c4e496cfa2dd0112023f0cb9902a3cfc91e544b84718d6010bf65ef37d701"

//Function to encrypt password using AES encryption
export const encryptData = (plainData) => {
  const secretKey = SECRET_KEY;
  return CryptoJS.AES.encrypt(plainData, secretKey).toString();
};