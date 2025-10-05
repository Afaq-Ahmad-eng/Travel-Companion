// src/app.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";


import authRoutes from "./modules/auth/auth.routes.js"; // keep auth public
import shareRoutes from "./modules/shareExperience/shareExperience.routes.js";
import { protectedRoutes } from "./middleware/protect.js";

const app = express();

app.use(cors({ 
  origin: "http://localhost:3000", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Public auth router (register/login etc)
app.use("/auth", authRoutes);

// Protect entire share module, then mount routes inside
app.use("/share", protectedRoutes, shareRoutes);

// Health
app.get("/", (req, res) => res.send("API running"));


export default app;