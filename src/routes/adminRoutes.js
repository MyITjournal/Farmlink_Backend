import express from "express";
import {
  getPendingVerifications,
  updateVerificationStatus,
  blockUser,
  removeListing,
  getAdminSummary,
} from "../controllers/adminController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/pending-verifications", authMiddleware, getPendingVerifications);
router.patch("/verification-status", authMiddleware, updateVerificationStatus);
router.delete("/users/:userId", authMiddleware, blockUser);
router.delete("/listings/:listingId", authMiddleware, removeListing);
router.get("/summary", authMiddleware, getAdminSummary);

export default router;
