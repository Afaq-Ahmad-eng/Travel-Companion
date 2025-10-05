// src/modules/shareExperience/shareExperience.routes.js
import express from "express";
import upload from "../../utils/multer.js";
import { shareExperience } from "./shareExperience.controller.js";

const router = express.Router();

// POST /share/   (because we'll mount router at /share)
router.post("/experience", upload.array("images", 20), shareExperience);

export default router;
