// farmer.controller.js
import Produce from '../models/produce.js';
import Farmer from '../models/farmer.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';

export const addProduceListing = async (req, res) => {
const farmerId = req.user.id;
const { productName, category, quantity, pricePerUnit, harvestDate, description, imageUrls } = req.body;

try {
if (!productName || !category || !quantity || !pricePerUnit) {
return errorResponse(res, 400, "Missing required product fields.");
}

const newListing = await Produce.create({
farmerId,
productName,
category,
quantity,
pricePerUnit,
harvestDate,
description,
imageUrls,
status: 'Active',
});

return successResponse(res, 201, "Product listing created successfully.", newListing);
} catch (error) {
console.error('Error creating listing:', error);
return errorResponse(res, 500, "Failed to create product listing.", error.message);
}
};

export const updateProduceListing = async (req, res) => {
const { listingId } = req.params;
const farmerId = req.user.id; // Ensure only the owner can update
const updates = req.body;

try {
const [rowsUpdated, [updatedListing]] = await Produce.update(updates, {
where: { id: listingId, farmerId },
returning: true, // Return the updated object
});

if (rowsUpdated === 0) {
return errorResponse(res, 404, "Listing not found or you do not have permission to update it.");
}

return successResponse(res, 200, "Product listing updated successfully.", updatedListing);
} catch (error) {
console.error('Error updating listing:', error);
return errorResponse(res, 500, "Failed to update product listing.", error.message);
}
};

export const deactivateListing = async (req, res) => {
const { listingId } = req.params;
const farmerId = req.user.id;

try {
const [rowsUpdated] = await Produce.update({ status: 'Deactivated' }, {
where: { id: listingId, farmerId },
});

if (rowsUpdated === 0) {
return errorResponse(res, 404, "Listing not found or not owned by you.");
}

return successResponse(res, 200, "Product listing deactivated successfully.");
} catch (error) {
console.error('Error deactivating listing:', error);
return errorResponse(res, 500, "Failed to deactivate listing.", error.message);
}
};

export const getFarmerDashboard = async (req, res) => {
const farmerId = req.user.id;

try {
// 1. Fetch Farmer Profile Data
const farmer = await Farmer.findByPk(farmerId, {
attributes: ['fullName', 'verificationStatus', 'profilePhoto'],
});

if (!farmer) {
return errorResponse(res, 404, "Farmer profile not found.");
}

// 2. Fetch All Listings (Product Cards/Table)
const listings = await Produce.findAll({
where: { farmerId },
attributes: ['id', 'productName', 'quantity', 'pricePerUnit', 'status', 'imageUrls'],
order: [['createdAt', 'DESC']],
});

// 3. Fetch Basic Insights (Placeholder for complex calculation)
const insights = await getFarmerInsightsInternal(farmerId);
return successResponse(res, 200, "Farmer dashboard data retrieved.", {
farmerProfile: farmer,
listings: listings,
insights: insights,
});

} catch (error) {
console.error('Error fetching farmer dashboard:', error);
return errorResponse(res, 500, "Failed to load dashboard data.", error.message);
}
};
const getFarmerInsightsInternal = async (farmerId) => {
const productViews = Math.floor(Math.random() * 500) + 100;
const popularItem = 'Tomatoes';
const averageMarketPrice = (Math.random() * 500 + 1500).toFixed(2); 

return {
productViews,
popularItems: popularItem,
averageMarketPrices: `₦${averageMarketPrice}/kg`,
};
};

// Export all controller functions
export default {
addProduceListing,
updateProduceListing,
deactivateListing,
getFarmerDashboard,
}