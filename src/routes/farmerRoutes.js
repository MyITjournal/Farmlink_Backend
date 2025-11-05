import express from "express";
import {
  addProduct,
  editProduct,
  toggleProductStatus,
  getFarmerDashboard,
} from "../controllers/farmerController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/products", authMiddleware, addProduct);
router.put("/products/:id", authMiddleware, editProduct);
router.patch("/products/:id/status", authMiddleware, toggleProductStatus);
router.get("/dashboard", authMiddleware, getFarmerDashboard);

export default router;
