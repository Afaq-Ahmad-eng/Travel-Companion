// src/app.js

//External modules
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

//Internal modules
import authRoutes from "./modules/auth/auth.routes.js";
import shareExperienceRoutes from "./modules/shareExperience/shareExperience.routes.js";
import profile from './modules/profile/profile.routes.js'
import budgets from "./modules/budget/budget.routes.js";
import TripPlan from "./modules/tripPlan/tripPlan.routes.js";
import adminRoutes from "./modules/admin/admin.routes.js";

//Middleware
import { protectedRoutes } from "./middleware/protect.js";
import { checkTripCompletion } from "./middleware/checkTripCompletion.js";

const app = express();

app.use(cors({ 
  origin: "http://localhost:3000", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Public Routes
app.use("/auth", authRoutes);

// Protect entire share module, then mount routes inside
app.use("/share", protectedRoutes, checkTripCompletion, shareExperienceRoutes);
app.use('/user',protectedRoutes,profile);
app.use("/budget",protectedRoutes,budgets);
app.use("/trip",protectedRoutes,TripPlan);

// Admin Routes
app.use("/admin", protectedRoutes, /* requireAdmin, */ adminRoutes);
app.get("/", (req, res) => res.send("API running"));


export default app;