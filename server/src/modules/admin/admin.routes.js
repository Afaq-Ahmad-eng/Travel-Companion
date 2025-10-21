import express from "express";
import {
    listUsers,
    getUserTrips,
    updateUser,
    deleteUser,
} from "./admin.controller.js";
import { validateUpdateUser } from "./admin.validator.js";
// import { requireAdmin } from "../../middleware/auth.js"; // uncomment if you have auth middleware

const router = express.Router();

// List users with optional ?q=&page=&limit=
router.get("/users", /* requireAdmin, */ listUsers);

// Get single user
router.get("/users/:id/trips", /* requireAdmin, */ getUserTrips);

// Update user (validate body with admin.validator.js)
router.put("/users/:id", /* requireAdmin, */ validateUpdateUser, updateUser);

// Delete user
router.delete("/users/:id", /* requireAdmin, */ deleteUser);

export default router;