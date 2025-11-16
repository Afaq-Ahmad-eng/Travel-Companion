// server/src/utils/mega.js
// import { Storage } from "megajs";

// export const uploadBufferToMega = async (buffer, fileName, userEmail, userPassword, folderName) => {
//   if (!buffer || !fileName) throw new Error("Buffer and fileName are required");
//   try {
//     // 1. Connect to MEGA
//     const storage = new Storage({
//       email: userEmail,
//       password: userPassword,
//     });

//     await storage.ready;

//     // 2. Find the folder you created manually
//     const folder = storage.root.children.find(c => c.name === folderName && c.directory);
//     if (!folder) throw new Error(`Folder "${folderName}" not found in MEGA`);

//     // 3. Upload file to that folder
//     const file = folder.upload({ name: fileName }, buffer);

//     return await new Promise((resolve, reject) => {
//       file.on("complete", uploadedFile => {
//         uploadedFile.link((err, link) => {
//           if (err) {
//             console.error("Error getting MEGA link:", err);
//             reject(err);
//           }
//           resolve(link); // public link
//         });
//       });

//       file.on("error", err => {
//         console.error("Error uploading to MEGA:", err);
//         reject(err);
//       });
//     });
//   } catch (err) {
//     console.error("MEGA upload error:", err);
//     throw err;
//   }
// };


import ImageKit from "imagekit";

import dotenv from "dotenv";

dotenv.config();

export const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

// /**
//  * Upload an image buffer directly to ImageKit
//  * @param {Buffer} buffer - The image file buffer from multer
//  * @param {string} fileName - The original filename
//  * @returns {string} - The uploaded image URL
//  */
// export const uploadBufferToImageKit = async (buffer, fileName) => {
//   if (!buffer || !fileName) throw new Error("Buffer and fileName are required");

//   try {
//     const file = req.file; // from multer
//     const uploadResponse = await imagekit.upload({
//       file: file.buffer, // actual file buffer
//       fileName: file.originalname,
//       folder: "/travel_experiences_images", // optional folder name in ImageKit
//     });

//     return uploadResponse.url; // Direct viewable URL
//   } catch (err) {
//     console.error("Error uploading to ImageKit:", err);
//     throw err;
//   }
// };
