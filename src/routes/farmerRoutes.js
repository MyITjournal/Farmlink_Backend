import express from "express";
import {
  addProduct,
  editProduct,
  toggleProductStatus,
  getFarmerDashboard,
} from "../controllers/farmerController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/products", protect, addProduct);
router.put("/products/:id", protect, editProduct);
router.patch("/products/:id/status", protect, toggleProductStatus);
router.get("/dashboard", protect, getFarmerDashboard);

export default router;
