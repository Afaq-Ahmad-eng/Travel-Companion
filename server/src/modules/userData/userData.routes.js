import express from 'express';
import { fetchUserData } from './userData.controller.js';

const router = express.Router();

router.get('/data-for-Report',fetchUserData)

export default router;