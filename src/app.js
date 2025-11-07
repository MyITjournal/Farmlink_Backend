import express from "express";
import cors from "cors";
import errorHandler from "./middlewares/errorHandler.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import farmerRoutes from "./routes/farmerRoutes.js";
import produceRoutes from "./routes/produceRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import { protect } from "./middlewares/authMiddleware.js";
import { isAdmin, isFarmer } from "./middlewares/roleMiddleware.js";

const app = express();

const corsOptions = { origin: process.env.CLIENT_URL || "*", credentials: true };

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use("/uploads", express.static("uploads"));

app.get("/api/health", (req, res) => res.json({ status: "API is running fine and healthy" }));

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/farmers", farmerRoutes);
app.use("/api/produce", produceRoutes);
app.use("/api/customers", customerRoutes);

app.get("/api/test/protected", protect, (req, res) => res.json({ success: true, user: req.user }));
app.get("/api/test/admin-only", protect, isAdmin, (req, res) => res.json({ success: true, message: "admin access granted" }));
app.get("/api/test/farmer-or-admin", protect, isFarmer, (req, res) => res.json({ success: true, message: "farmer access granted" }));

app.use((req, res) => res.status(404).json({ success: false, message: "Route does not exist" }));

app.use(errorHandler);

export default app;
