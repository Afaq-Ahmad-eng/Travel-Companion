//External library for AES encryption
import CryptoJS from "crypto-js";

//Secret key for AES encryption
const SECRET_KEY= "642c4e496cfa2dd0112023f0cb9902a3cfc91e544b84718d6010bf65ef37d701"

//Function to encrypt password using AES encryption
export const encryptData = (plainData) => {
  const secretKey = SECRET_KEY;
  return CryptoJS.AES.encrypt(plainData, secretKey).toString();
};

//Function to decrypt data
export const decryptData = (encryptedData) => {
    if (!encryptedData) {
    return null;
  }
  const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}


// Convert ArrayBuffer/Uint8Array to Base64 string
function arrayBufferToBase64(buffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary); // Base64
}

// Encrypt raw file binary
async function encryptFileForUpload(file, aesKey) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const arrayBuffer = reader.result;

      // Convert binary to Base64
      const base64String = arrayBufferToBase64(arrayBuffer);

      // Encrypt Base64 string with AES
      const encrypted = CryptoJS.AES.encrypt(base64String, aesKey).toString();

      resolve({
        name: file.name,
        type: file.type,
        size: file.size,
        content: encrypted, // AES-encrypted Base64 of binary
      });
    };

    reader.onerror = reject;
    reader.readAsArrayBuffer(file); // Read raw binary
  });
}

// Encrypt multiple files
export async function processImages(files, aesKey) {
  const encryptedImages = await Promise.all(
    files.map((file) => encryptFileForUpload(file, aesKey))
  );
  return encryptedImages;
}


export const encryptedImages = processImages;

// 🔓 Decrypt one file's content
function decryptFileForUse(encryptedFile) {
  if (!encryptedFile || !encryptedFile.content) {
    console.error("Invalid encrypted file object:", encryptedFile);
    return null;
  }

  try {
    // AES decrypt (gibberish → base64 gibberish)
    const decryptedContent = decryptData(encryptedFile.content);

    return {
      ...encryptedFile, 
      content: decryptedContent, // plain base64 gibberish (no prefix)
    };
  } catch (err) {
    console.error("Error while decrypting file:", err);
    return null;
  }
}

// 🔓 Handle one OR multiple files
export async function processDecryptedImages(input) {
  const files = Array.isArray(input) ? input : [input];

  console.log("Files to decrypt (normalized):", files);

  const decryptedFiles = files
    .map((file) => decryptFileForUse(file))
    .filter(Boolean);

  return Array.isArray(input) ? decryptedFiles : decryptedFiles[0];
}

