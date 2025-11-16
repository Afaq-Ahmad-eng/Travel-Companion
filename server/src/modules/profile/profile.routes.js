//Profile routes 
//External modules
import express from 'express';

//Internal modules
import { dataForBudgetManager, logOut, profile, tripPlanCancel, tripsPlanData } from './profile.controller.js';

const router = express.Router();

router.get("/profile",profile);

router.post("/profile/logout",logOut)

router.get("/profile/:user_id/budget-data", dataForBudgetManager)

router.get('/profile/:user_id/trips-plan-data',tripsPlanData)

router.put('/trip/cancel/:trip_id',tripPlanCancel)

export default router;