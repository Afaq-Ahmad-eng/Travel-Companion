//External modules
import express from "express";


//Express Router Middleware
const router = express.Router();



router.use("/auth", authRoutes);
