//External modules
import express from 'express'

//Internal modules
import { budgetManager, checkBudgetManagerStatus } from './budget.controller.js';

const router = express.Router();


router.post("/save", budgetManager);
router.get("/check", checkBudgetManagerStatus);

export default router;
