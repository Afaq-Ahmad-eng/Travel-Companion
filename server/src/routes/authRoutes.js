//External modules
import express from "express";

//Internal modules
import { registerUser, loginUser } from "../controllers/userController.js";


//Express Router Middleware
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;
