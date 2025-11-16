//External modules
import express from 'express'

//Internal modules
import { budgetManager, checkBudgetManagerStatus, unsetTripBudget } from './budget.controller.js';

const router = express.Router();


router.post("/save", budgetManager);
router.get("/check", checkBudgetManagerStatus);
router.get('/unset-trip-budget',unsetTripBudget)

export default router;
