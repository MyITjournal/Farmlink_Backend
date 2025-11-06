import express from "express";
import {
  getPendingVerifications,
  updateVerificationStatus,
  blockUser,
  removeListing,
  getAdminSummary,
} from "../controllers/adminController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/pending-verifications", protect, getPendingVerifications);
router.patch("/verification-status", protect, updateVerificationStatus);
router.delete("/users/:userId", protect, blockUser);
router.delete("/listings/:listingId", protect, removeListing);
router.get("/summary", protect, getAdminSummary);

export default router;
