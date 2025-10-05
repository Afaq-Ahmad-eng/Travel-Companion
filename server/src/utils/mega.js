// src/utils/mega.js
import { Storage } from "megajs";

export const uploadToMega = async (buffer, fileName, userEmail, userPassword, folderName) => {
  try {
    // 1. Connect to MEGA
    const storage = new Storage({
      email: userEmail,
      password: userPassword,
    });

    await storage.ready;

    // 2. Find the folder you created manually
    const folder = storage.root.children.find(c => c.name === folderName && c.directory);
    if (!folder) throw new Error(`Folder "${folderName}" not found in MEGA`);

    // 3. Upload file to that folder
    const file = folder.upload({ name: fileName }, buffer);

    return await new Promise((resolve, reject) => {
      file.on("complete", uploadedFile => {
        uploadedFile.link((err, link) => {
          if (err) reject(err);
          resolve(link); // public link
        });
      });

      file.on("error", reject);
    });
  } catch (err) {
    throw err;
  }
};
