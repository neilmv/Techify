import express from "express";
import { getRepairHistory } from "../controllers/historyController.js";
const router = express.Router();

router.get("/", getRepairHistory);
export default router;
