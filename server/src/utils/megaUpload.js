// //server/src/utils/megaUpload.js
// import fs from "fs";
// import {Storage} from "./mega.js";

// export const uploadLocalFileToMega = (localFilePath, remoteFileName) => {
//   return new Promise((resolve, reject) => {
//     const fileStream = fs.createReadStream(localFilePath);

//     const upload = Storage.upload({
//       name: remoteFileName,
//       allowUploadBuffering: true
//     }, fileStream);

//     upload.on('complete', file => {
//       resolve(file);
//     });

//     upload.on('error', err => {
//       reject(err);
//     });
//   });
// };



// export const getMegaLink = async (file) => {
//   return new Promise((resolve, reject) => {
//     file.link((err, link) => {
//       if (err) reject(err);
//       else {
//         resolve(link);
//       }
//     });
//   });
// };


// server/src/utils/imagekitUpload.js
import { imagekit } from "./mega.js";

/**
 * Uploads a file buffer to ImageKit in the specified folder.
 * Automatically creates the folder if it doesn't exist.
 * 
 * @param {Buffer} buffer - The file buffer (from multer)
 * @param {string} fileName - Original or generated file name
 * @param {string} folderName - Folder path in ImageKit (e.g. "travel_photos")
 * @returns {Promise<string>} - Returns public image URL
 */
export const uploadBufferToImageKit = async (buffer, fileName, folderName = "default_uploads") => {
  if (!buffer || !fileName) {
    throw new Error("Buffer and fileName are required");
  }

  try {
    const uploadResponse = await imagekit.upload({
      file: buffer,               // file buffer (from multer memoryStorage)
      fileName,                   // image name
      folder: `/${folderName}`,   // folder in your ImageKit account
    });

    return uploadResponse.url; // public CDN URL
  } catch (error) {
    console.error("Error uploading to ImageKit:", error.message);
    throw new Error("Image upload failed");
  }
};
