// produce.controller.js
import Produce from '../models/produce.model.js';
import Farmer from '../models/farmer.model.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';
import { Op } from 'sequelize'; 

export const getAllProduceListings = async (req, res) => {
    // Extract query parameters for filtering and searching
    const { search, category, location, minPrice, maxPrice } = req.query;

    // Build the dynamic WHERE clause for the query
    const whereClause = {
        status: 'Active', // Only show active listings
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
            include: [{
                model: Farmer,
                attributes: ['fullName', 'location', 'rating', 'verificationStatus'],
                // Ensure the farmer is verified before showing their products (Trust Gate)
                where: { verificationStatus: 'Verified' }
            }],
            order: [['createdAt', 'DESC']],
        });

        return successResponse(res, 200, "Marketplace listings retrieved successfully.", listings);
    } catch (error) {
        console.error('Error fetching marketplace listings:', error);
        return errorResponse(res, 500, "Failed to retrieve marketplace listings.", error.message);
    }
};

export const getProduceDetails = async (req, res) => {
    const { listingId } = req.params;

    try {
        const listing = await Produce.findOne({
            where: { id: listingId, status: 'Active' },
            // Include all necessary farmer details for display and contact
            include: [{
                model: Farmer,
                attributes: [
                    'fullName', 'phone', 'location', 'rating', 'verificationStatus'
                ],
                where: { verificationStatus: 'Verified' }
            }],
        });

        if (!listing) {
            return errorResponse(res, 404, "Product listing not found or is currently unavailable.");
        }
        
        return successResponse(res, 200, "Product details retrieved successfully.", listing);
    } catch (error) {
        console.error('Error fetching product details:', error);
        return errorResponse(res, 500, "Failed to retrieve product details.", error.message);
    }
};


// Allows a buyer to rate a farmer after a transaction (implied post-purchase feature).
export const rateFarmer = async (req, res) => {
    const { farmerId, rating } = req.body;
    const buyerId = req.user.id; // Buyer must be logged in

    try {
        if (rating < 1 || rating > 5) {
            return errorResponse(res, 400, "Rating must be between 1 and 5.");
        }

        const farmer = await Farmer.findByPk(farmerId);

        if (!farmer) {
            return errorResponse(res, 404, "Farmer not found.");
        }
        const newRating = (parseFloat(farmer.rating) + rating) / 2; 

        await farmer.update({ rating: newRating.toFixed(2) });

        return successResponse(res, 200, `Farmer rated successfully. New rating: ${newRating.toFixed(2)}`, { newRating: newRating.toFixed(2) });

    } catch (error) {
        console.error('Error rating farmer:', error);
        return errorResponse(res, 500, "Failed to submit rating.", error.message);
    }
};

// Export all controller functions
export default {
    getAllProduceListings,
    getProduceDetails,
    rateFarmer,
};
