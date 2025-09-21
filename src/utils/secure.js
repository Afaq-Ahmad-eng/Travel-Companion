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
  const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}

// 🔒 Encrypt one file
async function encryptFileForUpload(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const fileContent = reader.result; // full base64 (includes data:image/...;base64,)
      
      // Remove the prefix BEFORE encrypting
      const base64Only = fileContent.replace(/^data:[^,]+,/, "");

      // Encrypt only the base64 gibberish
      const encryptedContent = encryptData(base64Only);

      resolve({
        name: file.name,
        type: file.type,
        size: file.size,
        content: encryptedContent, // only encrypted gibberish
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file); // Convert file to Base64
  });
}

// 🔒 Encrypt multiple files
export async function processImages(images) {
  const encryptedImages = await Promise.all(
    images.map((file) => encryptFileForUpload(file))
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

