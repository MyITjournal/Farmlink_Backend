import models from "../models/index.js";
import { Op } from "sequelize";
import AppError from "../utils/AppError.js";

const { Produce, Farmer } = models;

const getAllProduceListings = async (req, res) => {
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
      include: [
        {
          model: Farmer,
          attributes: ["farmName", "farmType", "verificationStatus"],
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
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to retrieve marketplace listings",
    });
  }
};

const getProduceDetails = async (req, res) => {
  const { listingId } = req.params;

  try {
    const listing = await Produce.findOne({
      where: { id: listingId, status: "Active" },
      include: [
        {
          model: Farmer,
          attributes: ["farmName", "farmType", "bio", "verificationStatus"],
          where: { verificationStatus: "Verified" },
        },
      ],
    });

    if (!listing) {
      throw new AppError(
        "Product listing not found or is currently unavailable",
        404
      );
    }

    res.status(200).json({
      success: true,
      message: "Product details retrieved successfully",
      data: listing,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to retrieve product details",
    });
  }
};

// Allows a buyer to rate a farmer after a transaction (implied post-purchase feature).
const rateFarmer = async (req, res) => {
  const { farmerId, rating } = req.body;

  try {
    if (rating < 1 || rating > 5) {
      throw new AppError("Rating must be between 1 and 5", 400);
    }

    const farmer = await Farmer.findOne({ where: { userId: farmerId } });

    if (!farmer) {
      throw new AppError("Farmer not found", 404);
    }

    const currentRating = parseFloat(farmer.rating) || 0;
    const newRating = (currentRating + rating) / 2;

    await farmer.update({ rating: newRating.toFixed(2) });

    res.status(200).json({
      success: true,
      message: `Farmer rated successfully. New rating: ${newRating.toFixed(2)}`,
      data: { newRating: newRating.toFixed(2) },
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to submit rating",
    });
  }
};

export { getAllProduceListings, getProduceDetails, rateFarmer };
