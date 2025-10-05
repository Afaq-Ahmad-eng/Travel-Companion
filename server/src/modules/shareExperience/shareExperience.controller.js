// src/modules/shareExperience/shareExperience.controller.js
import { uploadBufferToMega } from "../../utils/mega.js";
import {
  saveExperience,
  saveExperienceImages,
} from "./shareExperience.service.js";
import { encryptData } from "../../utils/secure.js";
import { shareExperienceSchema } from "./shareExperience.validator.js";
export const shareExperience = async (req, res) => {
  try {
    const { title, description, blog, rating } = req.body;
    const files = req.files; // from multer (memory buffer)

    const filteredImages = files.map((file) => ({
      mimetype: file.mimetype,
    }));

    const dataToValidate = {
      title,
      description,
      blog,
      rating: Number(rating),
      images: filteredImages,
    };

    const { error } = shareExperienceSchema.validate(dataToValidate, {
      abortEarly: false,
    });

    if (error) {
      // Return structured response — no UI, no console, no messages
      return res.status(400).json({
        success: false,
        message: "VALIDATION_ERROR",
        count: error.details.length,
      });
    }
    if (!files || files.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "At least one picture is required!" });
    }

    // 🔑 For demo: use one app-level MEGA account
    const MEGA_EMAIL = process.env.MEGA_EMAIL;
    const MEGA_PASSWORD = process.env.MEGA_PASSWORD;
    const FOLDER_NAME = process.env.FOLDER_NAME;

    // Upload each file to MEGA
    const pictureUrls = [];
    for (const file of files) {
      const url = await uploadBufferToMega(
        file.buffer,
        file.originalname,
        MEGA_EMAIL,
        MEGA_PASSWORD,
        FOLDER_NAME
      );
      pictureUrls.push(url);
    }

    //Encrypted uploaded images which we get's from the MEGA cloud place
    const encryptedPictureUrls = pictureUrls.map((url) => encryptData(url));

    // If you want to track user → req.user?.id from protectedRoutes
    const user_id = req.user ? req.user.user_id : null;

    // Save experience in DB
    const newTrip = await saveExperience({
      title,
      description,
      blog,
      rating,
      user_id,
    });

    //We save the images url's which we get from the MEGA cloud place
    let newTripImagesUrls;
    if (
      Array.isArray(encryptedPictureUrls) &&
      encryptedPictureUrls.length > 0
    ) {
      const experienceId = newTrip.experience_id;
      newTripImagesUrls = await saveExperienceImages({
        encryptedPictureUrls,
        experienceId,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Trip shared successfully!",
      data: newTrip,
    });
  } catch (err) {
    return res
      .status(500)
      .json({
        status: err.status,
        success: false,
        message: err.message || "Internal Server Error",
      });
  }
};
