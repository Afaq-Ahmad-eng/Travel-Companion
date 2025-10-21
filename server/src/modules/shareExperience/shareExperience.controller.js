// src/modules/shareExperience/shareExperience.controller.js
// import { uploadBufferToMega } from "../../utils/mega.js";
// import {
//   saveExperience,
//   saveExperienceImages,
// } from "./shareExperience.service.js";
// import { encryptData } from "../../utils/secure.js";
// import { shareExperienceSchema } from "./shareExperience.validator.js";
// export const shareExperience = async (req, res) => {
//   try {
//     const { title, description, blog, rating } = req.body;
//     const files = req.files; // from multer (memory buffer)
    
//     const filteredImages = files.map((file) => ({
//       mimetype: file.mimetype,
//     }));
  

//     const dataToValidate = {
//       title,
//       description,
//       blog,
//       rating: Number(rating),
//       images: filteredImages,
//     };

//     const { error } = shareExperienceSchema.validate(dataToValidate, {
//       abortEarly: false,
//     });

//     if (error) {
//       // Return structured response — no UI, no console, no messages
//       return res.status(400).json({
//         success: false,
//         message: "VALIDATION_ERROR",
//         count: error.details.length,
//       });
//     }
//     if (!files || files.length === 0) {
//       return res
//         .status(400)
//         .json({ success: false, message: "At least one picture is required!" });
//     }

//     // 🔑 For demo: use one app-level MEGA account
//     const MEGA_EMAIL = process.env.MEGA_EMAIL;
//     const MEGA_PASSWORD = process.env.MEGA_PASSWORD;
//     const FOLDER_NAME = process.env.FOLDER_NAME;

//     // Upload each file to MEGA
//     const pictureUrls = [];
//     for (const file of files) {
//       const url = await uploadBufferToMega(
//         file.buffer,
//         file.originalname,
//         MEGA_EMAIL,
//         MEGA_PASSWORD,
//         FOLDER_NAME
//       );
//       pictureUrls.push(url);
//     }
      
//     let encryptedPictureUrls = undefined;
//     //Encrypted uploaded images which we get's from the MEGA cloud place
    
//      encryptedPictureUrls = pictureUrls.map((url) => encryptData(url));
//     // If you want to track user → req.user?.id from protectedRoutes
//     const user_id = req.user ? req.user.user_id : null;

//     // Save experience in DB
//     const newTrip = await saveExperience({
//       title,
//       description,
//       blog,
//       rating,
//       user_id,
//     });

//     //We save the images url's which we get from the MEGA cloud place
//     let newTripImagesUrls = undefined;
//     if (
//       Array.isArray(encryptedPictureUrls) &&
//       encryptedPictureUrls.length > 0
//     ) {
//       const experienceId = newTrip.experience_id;
//       newTripImagesUrls = await saveExperienceImages({
//         encryptedPictureUrls,
//         experienceId,
//       });
//     }

//     return res.status(201).json({
//       success: true,
//       message: "Trip shared successfully!",
//       data: newTrip,
//     });
//   } catch (err) {
//     return res
//       .status(500)
//       .json({
//         isExperienceTitleExist: err.isExperienceTitleExist,
//         status: err.status,
//         success: false,
//         message: err.message || "Internal Server Error",
//       });
//   }
// };


import { uploadBufferToImageKit } from "../../utils/megaUpload.js";
import { encryptData } from "../../utils/secure.js";
import { saveExperience, saveExperienceImages, getLatestTripByUserId } from "./shareExperience.service.js";

export const shareExperience = async (req, res) => {
  try {
    const { title, description, blog, rating } = req.body;
    const files = req.files;
    const folderName = "traveler_experiences_images"; // or dynamic, e.g. `user_${req.user.user_id}`

    if (!files || files.length === 0) {
      return res.status(400).json({ success: false, message: "At least one image is required!" });
    }

    const pictureUrls = [];

    for (const file of files) {
      const url = await uploadBufferToImageKit(file.buffer, file.originalname, folderName);
      pictureUrls.push(encryptData(url));
    }

    const user_id = req.user ? req.user.user_id : null;
    const latestTrip = await getLatestTripByUserId(user_id);

    const newTrip = await saveExperience({
      title,
      description,
      blog,
      rating,
      trip_id: latestTrip.trip_id,
    });

    if (pictureUrls.length > 0) {
      await saveExperienceImages({
        encryptedPictureUrls: pictureUrls,
        experienceId: newTrip.experience_id,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Trip shared successfully!",
      data: newTrip,
    });
  } catch (error) {
    console.error("Share Experience Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const fetchLatestTripData = async (req, res) => {
  try {
    const user_id = req.user ? req.user.user_id : null;

    const trip = await getLatestTripByUserId(user_id);
    console.log("we get trip data ", trip);
    

    if (!trip) {
      return res.status(404).json({ success: false, message: "No trip found." });
    }

    return res.status(200).json({ success: true, data: trip });
  } catch (error) {
    console.error("Fetch Latest Trip Data Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
