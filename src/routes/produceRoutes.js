import express from "express";
import {
  getAllProduceListings,
  getProduceDetails,
  rateFarmer,
} from "../controllers/produceController.js";
import { rateFarmerValidator } from "../utils/validators.js";
import validationMiddleware from "../middlewares/validationMiddleware.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getAllProduceListings);
router.get("/:listingId", getProduceDetails);
router.post(
  "/rate",
  protect,
  rateFarmerValidator,
  validationMiddleware,
  rateFarmer
);

export default router;
