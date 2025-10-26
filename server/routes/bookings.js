import express from "express";
import { createBooking, getBookings } from "../controllers/bookingController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/", verifyToken, createBooking);
router.get("/", verifyToken, getBookings);

export default router;
