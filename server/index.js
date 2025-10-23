import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import db from "./config/db.js";

import authRoutes from "./routes/auth.js";
import bookingRoutes from "./routes/bookings.js";
import paymentRoutes from "./routes/payments.js";
import serviceRoutes from "./routes/services.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/payments", paymentRoutes);

db.query("SELECT 1")
  .then(() => console.log("✅ Database connected successfully"))
  .catch((err) => console.error("❌ DB Connection Error:", err.message));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
