// auth.routes.js
import express from "express";
import { register, login, adminRegister, adminLogin } from "./auth.controller.js";

const router = express.Router();

router.post("/user/register", register);
router.post("/user/login", login);

//admin authentication

router.post('/admin/register',adminRegister)
router.post('/admin/login', adminLogin)

export default router;
