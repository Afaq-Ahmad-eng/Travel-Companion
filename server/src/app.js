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
import contactInformation from './modules/contact/contact.routes.js'
import userData from './modules/userData/userData.routes.js'

import testingPurpose from './modules/test/test.routes.js'

//Middleware
import { protectedRoutes } from "./middleware/protect.js";
// import { checkTripCompletion } from "./middleware/checkTripCompletion.js";
import { errorHandler } from "./middleware/errorHandler.js";

//Verify the admin
import { verifyAdmin } from "./middleware/verifyAdmin.js";
import { adminProtectedRoutes } from "./middleware/adminProtectedRoutes.js";

const app = express();

// app.use(cors({ 
//   origin: "http://localhost:3000", 
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   credentials: true 
// }));

app.use(cors({
  origin: function (origin, callback) {
    callback(null, true); // Reflect all origins automatically
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



// Public Routes
app.use("/auth", authRoutes);

// Protect entire share module, then mount routes inside
app.use("/share", protectedRoutes, /*"checkTripCompletion",*/ shareExperienceRoutes);
app.use('/user',protectedRoutes,profile);
app.use("/budget",protectedRoutes,budgets);
app.use("/trip",protectedRoutes,TripPlan);
app.use('/contact', protectedRoutes,contactInformation)
app.use("/user", protectedRoutes, userData)

app.use("/testing",testingPurpose)

// Admin Routes
app.use("/admin",adminProtectedRoutes, /* requireAdmin, */ adminRoutes);
app.get("/", (req, res) => res.send("API running"));

//error handler 
app.use(errorHandler);

export default app;