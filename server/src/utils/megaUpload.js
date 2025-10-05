import fs from "fs";
import megaStorage from "./mega.js";

export const uploadLocalFileToMega = (localFilePath, remoteFileName) => {
  return new Promise((resolve, reject) => {
    const fileStream = fs.createReadStream(localFilePath);

    const upload = megaStorage.upload({
      name: remoteFileName,
      allowUploadBuffering: true
    }, fileStream);

    upload.on('complete', file => {
      resolve(file);
    });

    upload.on('error', err => {
      reject(err);
    });
  });
};



export const getMegaLink = async (file) => {
  return new Promise((resolve, reject) => {
    file.link((err, link) => {
      if (err) reject(err);
      else {
        resolve(link);
      }
    });
  });
};
