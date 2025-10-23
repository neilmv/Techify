import express from "express";
import { getServices, getServiceTypes } from "../controllers/serviceController.js";

const router = express.Router();

router.get("/", getServices);

router.get("/types", getServiceTypes);

export default router;
