import express from "express";
import upload from "../../utils/multer.js";
import { contactInfo } from "./contact.controller.js";

const router = express.Router();

router.post("/info",upload.array('attachment',1),contactInfo);


export default router;