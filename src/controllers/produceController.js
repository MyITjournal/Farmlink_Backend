import models from "../models/index.js";
import { Op } from "sequelize";
import AppError from "../utils/AppError.js";

const { Produce, Farmer } = models;

async function getAllProduceListings(req, res) {
  const { category, minPrice, maxPrice } = req.query;
  const whereClause = {
    status: "Active",
  };

  if (category) {
    whereClause.category = category;
  }

  // Filter by price range
  if (minPrice || maxPrice) {
    whereClause.pricePerUnit = {};
    if (minPrice) whereClause.pricePerUnit[Op.gte] = parseFloat(minPrice);
    if (maxPrice) whereClause.pricePerUnit[Op.lte] = parseFloat(maxPrice);
  }

  try {
    const listings = await Produce.findAll({
      where: whereClause,
      // Include the Farmer's data (seller) for display on the Product Card
      include: [
        {
          model: Farmer,
          attributes: ["fullName", "location", "rating", "verificationStatus"],
          // Ensure the farmer is verified before showing their products
          where: { verificationStatus: "Verified" },
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      message: "Marketplace listings retrieved successfully",
      data: listings,
    });
  } catch (error) {
    throw new AppError(error.message || "Failed to retrieve marketplace listings", 500);
  }
}

async function getProduceDetails(req, res) {
  const { listingId } = req.params;

  try {
    const listing = await Produce.findOne({
      where: { id: listingId, status: "Active" },
      include: [
        {
          model: Farmer,
          attributes: [
            "fullName",
            "phone",
            "location",
            "rating",
            "verificationStatus",
          ],
          where: { verificationStatus: "Verified" },
        },
      ],
    });

    if (!listing) {
      throw new AppError("Product listing not found or is currently unavailable", 404);
    }

    res.status(200).json({
      success: true,
      message: "Product details retrieved successfully",
      data: listing,
    });
  } catch (error) {
    throw new AppError(error.message || "Failed to retrieve product details", 500);
  }
}

// Allows a buyer to rate a farmer after a transaction (implied post-purchase feature).
async function rateFarmer(req, res) {
  const { farmerId, rating } = req.body;
  const buyerId = req.user.id; // Buyer must be logged in

  try {
    if (rating < 1 || rating > 5) {
      throw new AppError("Rating must be between 1 and 5", 400);
    }

    const farmer = await Farmer.findByPk(farmerId);

    if (!farmer) {
      throw new AppError("Farmer not found", 404);
    }
    const newRating = (parseFloat(farmer.rating) + rating) / 2;

    await farmer.update({ rating: newRating.toFixed(2) });

    res.status(200).json({
      success: true,
      message: `Farmer rated successfully. New rating: ${newRating.toFixed(2)}`,
      data: { newRating: newRating.toFixed(2) },
    });
  } catch (error) {
    throw new AppError(error.message || "Failed to submit rating", 500);
  }
}

export {
  getAllProduceListings,
  getProduceDetails,
  rateFarmer,
};
