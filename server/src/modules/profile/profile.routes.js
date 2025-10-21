//Profile routes 

//External modules
import express from 'express';

//Internal modules
import { profile } from './profile.controller.js';

const router = express.Router();

router.get("/profile",profile);

export default router;