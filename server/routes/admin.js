import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import {
  createService,
  createServiceType,
  deleteService,
  deleteServiceType,
  deleteUser,
  getAllBookings,
  getDashboardStats,
  getRevenueAnalytics,
  getServices,
  getServiceTypes,
  getUsers,
  updateBookingStatus,
  updateService,
  updateServiceType
} from "../controllers/adminController.js";
import { verifyAdmin } from "../middleware/authMiddleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for file uploads - FIXED PATH
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), "uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "service-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB limit
  },
});

// Dashboard
router.get("/dashboard/stats", verifyAdmin, getDashboardStats);
router.get("/dashboard/analytics/revenue", verifyAdmin, getRevenueAnalytics);

// Users management
router.get("/users", verifyAdmin, getUsers);
router.delete("/users/:id", verifyAdmin, deleteUser);

// Bookings management
router.get("/bookings", verifyAdmin, getAllBookings);
router.patch("/bookings/:bookingId/status", verifyAdmin, updateBookingStatus);

// Services management
router.get("/services", verifyAdmin, getServices);
router.post("/services", verifyAdmin, createService);
router.put("/services/:id", verifyAdmin, updateService);
router.delete("/services/:id", verifyAdmin, deleteService);


// Service Types management
router.get("/service-types", verifyAdmin, getServiceTypes);
router.post("/service-types", verifyAdmin, createServiceType);
router.put("/service-types/:id", verifyAdmin, updateServiceType);
router.delete("/service-types/:id", verifyAdmin, deleteServiceType);


// Image upload route - FIXED: This matches your frontend API call
// In your adminRoutes.js - update the upload route
router.post(
  "/services/upload",
  verifyAdmin,
  upload.single("image"),
  (req, res) => {
    try {
      console.log("Upload request received:", {
        file: req.file,
        body: req.body,
        headers: req.headers,
      });

      if (!req.file) {
        console.log("No file received in upload");
        return res.status(400).json({ message: "No image file provided" });
      }

      // Return the path that will be stored in database
      const imageUrl = `/uploads/${req.file.filename}`;
      console.log("Image uploaded successfully:", {
        filename: req.file.filename,
        path: req.file.path,
        size: req.file.size,
        imageUrl: imageUrl,
      });

      res.json({
        message: "Image uploaded successfully",
        imageUrl: imageUrl,
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      res.status(500).json({ message: "Error uploading image" });
    }
  }
);

export default router;
