// auth.routes.js
import express from "express";
import { register, login, adminRegister, adminLogin, checkTokenAndShowTheLogout, forgetPassword } from "./auth.controller.js";

const router = express.Router();

router.post("/user/register", register);
router.post("/user/login", login);

//admin authentication

router.post('/admin/register',adminRegister)
router.post('/admin/login', adminLogin)

//check token and set the sign in button as a logout 
router.get('/set-sign-in-and-log-out/check', checkTokenAndShowTheLogout)

//forget password 
router.post('/forget-passwrod',forgetPassword);

export default router;
