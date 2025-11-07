import express from "express";
import { getPendingVerifications, updateVerificationStatus, blockUser, removeListing, getAdminSummary } from "../controllers/adminController.js"
import { protect } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/roleMiddleware.js";

const router = express.Router();
router.use(protect, isAdmin);

router.get("/verifications/pending", getPendingVerifications);
router.patch("/verifications/status", updateVerificationStatus);
router.delete("/users/:userUuid", blockUser);
router.delete("/listings/:listingId", removeListing);
router.get("/summary", getAdminSummary);

export default router;
