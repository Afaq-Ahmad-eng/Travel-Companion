import express from "express";
import {testing} from './test.controller.js'

const router = express.Router();


// router.get("/:trip_id/test", testing);

router.get('/get-total-trips-of-a-user',testing)

export default router;