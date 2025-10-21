import express from "express";
import createTripPlan from "./tripPlan.controller.js";

const router = express.Router();


router.post("/plan", createTripPlan);

export default router;