// src/modules/user/user.routes.js
import express from "express";
import { createUser, getUsers } from "./user.controller.js";

const router = express.Router();

router.post("/create", createUser); // POST /users
router.get("/getdata", getUsers);    // GET /users

export default router;
