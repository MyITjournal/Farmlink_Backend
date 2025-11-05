import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/roleMiddleware.js";
import {
  requestVerification,
  verifyToken,
  getCustomerVerifications,
} from "../controllers/verificationController.js";
import {
  verificationRequestValidator,
  verifyTokenValidator,
} from "../utils/validators.js";

const router = express.Router();

router.post("/", verificationRequestValidator, requestVerification);
router.post("/verify", verifyTokenValidator, verifyToken);
router.get("/customer/:customerId", protect, isAdmin, getCustomerVerifications);

export default router;
