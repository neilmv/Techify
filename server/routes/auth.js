import express from "express";
import {
    getProfile,
    loginUser,
    registerAdmin,
    registerUser,
    updateProfile,
    updateProfilePicture
} from "../controllers/authController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/register-admin", registerAdmin); // Separate admin registration
router.post("/login", loginUser);
router.get("/profile", verifyToken, getProfile);
router.patch("/profile", verifyToken, updateProfile);
router.patch("/profile/picture", verifyToken, updateProfilePicture);

export default router;