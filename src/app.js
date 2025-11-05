import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db_files.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import farmerRoutes from "./routes/farmerRoutes.js";
import produceRoutes from "./routes/produceRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import verificationRoutes from "./routes/verificationRoutes.js";
import { protect } from "./middleware/authMiddleware.js";
import { isAdmin, isFarmer } from "./middleware/roleMiddleware.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Initialize DB (non-blocking)
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/farmers", farmerRoutes);
app.use("/api/produce", produceRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/verification", verificationRoutes);

// Test endpoints for middleware
app.get("/api/test/protected", protect, (req, res) => {
  res.json({ success: true, user: req.user });
});

app.get("/api/test/admin-only", protect, isAdmin, (req, res) => {
  res.json({ success: true, message: "admin access granted" });
});

app.get("/api/test/farmer-or-admin", protect, isFarmer, (req, res) => {
  res.json({ success: true, message: "farmer access granted" });
});

export default app;
