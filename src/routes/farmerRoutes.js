import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { isFarmer } from "../middleware/roleMiddleware.js";
import {
  addProduceListing,
  updateProduceListing,
  deactivateListing,
  getFarmerDashboard,
} from "../controllers/farmerController.js";
import { addListingValidator } from "../utils/validators.js";

const router = express.Router();

// Every farmer route requires the user to be an authenticated farmer
router.use(protect, isFarmer);

router.post("/listings", addListingValidator, addProduceListing);
router.put("/listings/:listingId", updateProduceListing);
router.patch("/listings/:listingId/deactivate", deactivateListing);
router.get("/dashboard", getFarmerDashboard);

export default router;
