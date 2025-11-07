import models from "../models/index.js";
import { Op } from "sequelize";
import AppError from "../utils/AppError.js";

const { Produce, Farmer } = models;

export async function getAllProduceListings(req, res, next) {
  try {
    const { category, minPrice, maxPrice, page = 1, limit = 20 } = req.query;
    const whereClause = { status: "Active" };
    if (category) whereClause.category = category;
    if (minPrice || maxPrice) {
      whereClause.pricePerUnit = {};
      if (minPrice) whereClause.pricePerUnit[Op.gte] = parseFloat(minPrice);
      if (maxPrice) whereClause.pricePerUnit[Op.lte] = parseFloat(maxPrice);
    }

    const offset = (Number(page) - 1) * Number(limit);
    const listings = await Produce.findAll({
      where: whereClause,
      include: [{ model: Farmer, as: "farmer", attributes: ["user_uuid", "farmName", "verificationStatus", "rating"], where: { verificationStatus: "Verified" } }],
      order: [["createdAt", "DESC"]],
      limit: Number(limit),
      offset,
    });

    return res.status(200).json({ success: true, message: "Listings retrieved", data: listings });
  } catch (error) {
    return next(new AppError(error.message || "Failed to retrieve marketplace listings", 500));
  }
}

export async function getProduceDetails(req, res, next) {
  try {
    const { listingId } = req.params;
    if (!listingId) return next(new AppError("Listing ID is required", 400));
    const listing = await Produce.findOne({
      where: { id: listingId, status: "Active" },
      include: [{ model: Farmer, as: "farmer", attributes: ["user_uuid", "farmName", "location", "rating", "verificationStatus"], where: { verificationStatus: "Verified" } }],
    });
    if (!listing) return next(new AppError("Product listing not found or unavailable", 404));
    return res.status(200).json({ success: true, message: "Product details retrieved", data: listing });
  } catch (error) {
    return next(new AppError(error.message || "Failed to retrieve product details", 500));
  }
}

export async function rateFarmer(req, res, next) {
  try {
    const { farmerId, rating } = req.body;
    const buyerId = req.user?.user_uuid || req.user?.id;
    if (!buyerId) return next(new AppError("Unauthorized", 401));
    if (!farmerId || !rating) return next(new AppError("farmerId and rating are required", 400));
    if (rating < 1 || rating > 5) return next(new AppError("Rating must be between 1 and 5", 400));

    const farmer = await Farmer.findByPk(farmerId);
    if (!farmer) return next(new AppError("Farmer not found", 404));

    // naive average update: store previous rating and count would be better
    // If you have ratingCount, do weighted average. Here we implement simple weighted with existing count if present.
    const prevRating = Number(farmer.rating) || 0;
    const prevCount = Number(farmer.ratingCount) || 0;
    const newCount = prevCount + 1;
    const newRating = ((prevRating * prevCount) + Number(rating)) / newCount;

    await farmer.update({ rating: parseFloat(newRating.toFixed(2)), ratingCount: newCount });
    return res.status(200).json({ success: true, message: `Farmer rated successfully. New rating: ${newRating.toFixed(2)}`, data: { newRating: newRating.toFixed(2) } });
  } catch (error) {
    return next(new AppError(error.message || "Failed to submit rating", 500));
  }
}
