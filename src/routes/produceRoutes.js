import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { isCustomer } from "../middleware/roleMiddleware.js";
import {
  getAllProduceListings,
  getProduceDetails,
  rateFarmer,
} from "../controllers/produceController.js";
import { rateFarmerValidator } from "../utils/validators.js";

const router = express.Router();

router.get("/", getAllProduceListings);
router.get("/:listingId", getProduceDetails);
router.post(
  "/rate",
  protect,
  isCustomer,
  rateFarmerValidator,
  rateFarmer
);

export default router;
