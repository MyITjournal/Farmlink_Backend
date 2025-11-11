import express from "express";
import errorHandler from "./middlewares/errorHandler.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import farmerRoutes from "./routes/farmerRoutes.js";
import produceRoutes from "./routes/produceRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import { protect } from "./middlewares/authMiddleware.js";
import { isAdmin, isFarmer } from "./middlewares/roleMiddleware.js";
import cors from "cors";

// Init express app
const app = express();
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://aisdev979.github.io/FarmLink/frontend",
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (
      allowedOrigins.indexOf(origin) !== -1 ||
      process.env.NODE_ENV === "development"
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

// Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "API is running fine and healthy" });
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/farmers", farmerRoutes);
app.use("/api/produce", produceRoutes);
app.use("/api/customers", customerRoutes);

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

// Route defaults
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: "Route does not exist" });
});

app.use(errorHandler);

export default app;
