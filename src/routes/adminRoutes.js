import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/roleMiddleware.js";
import {
  getPendingVerifications,
  updateVerificationStatus,
  blockUser,
  removeListing,
  getAdminSummary,
} from "../controllers/adminController.js";

const router = express.Router();

// Require an authenticated admin for everything in this router
router.use(protect, isAdmin);

router.get("/pending-verifications", getPendingVerifications);
router.patch("/verification-status", updateVerificationStatus);
router.delete("/users/:userId", blockUser);
router.delete("/listings/:listingId", removeListing);
router.get("/summary", getAdminSummary);

export default router;
