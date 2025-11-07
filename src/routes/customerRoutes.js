import express from "express";
import { getAllCustomers, getCustomerById, updateCustomer, deleteCustomer } from "../controllers/customerController.js";
import { protect } from "../middlewares/authMiddleware.js";
import validationMiddleware from "../middlewares/validationMiddleware.js";
import { registrationValidator } from "../utils/validators.js"; // if updating similar fields

const router = express.Router();

// Admin-only get all (you can change to public or specific roles)
router.get("/", protect, getAllCustomers);

// Get specific customer (customer can view own or admin)
router.get("/:id", protect, getCustomerById);

// Update — apply validation where required
router.put("/:id", protect, updateCustomer);

// Delete (admin only ideally)
router.delete("/:id", protect, deleteCustomer);

export default router;
