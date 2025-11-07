import express from "express";
import { addProduct, editProduct, toggleProductStatus, getFarmerDashboard, getAllFarmers } from "../controllers/farmerController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { isFarmer, isAdmin } from "../middlewares/roleMiddleware.js";
import validationMiddleware from "../middlewares/validationMiddleware.js";
import { addListingValidator } from "../utils/validators.js";

const router = express.Router();

router.get("/", protect, isAdmin, getAllFarmers); // admin-only listing
router.post("/products", protect, isFarmer, addListingValidator, validationMiddleware, addProduct);
router.put("/products/:id", protect, isFarmer, editProduct);
router.patch("/products/:id/status", protect, isFarmer, toggleProductStatus);
router.get("/dashboard", protect, isFarmer, getFarmerDashboard);

export default router;
