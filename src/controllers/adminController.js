// admin.controller.js
import Farmer from '../models/farmer.js';
import Produce from '../models/produce.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';

export const getPendingVerifications = async (req, res) => {
try {
const pendingUsers = await Farmer.findAll({
where: { verificationStatus: 'Pending' },
attributes: ['id', 'fullName', 'nin', 'phone', 'role', 'createdAt', 'location'],
order: [['createdAt', 'ASC']],
});

return successResponse(res, 200, "Pending users retrieved.", pendingUsers);
} catch (error) {
console.error('Error fetching pending users:', error);
return errorResponse(res, 500, "Failed to retrieve pending verifications.");
}
};

export const updateVerificationStatus = async (req, res) => {
const { userId, status } = req.body; // status must be 'Verified' or 'Rejected'

if (!['Verified', 'Rejected'].includes(status)) {
return errorResponse(res, 400, "Invalid status provided. Must be 'Verified' or 'Rejected'.");
}

try {
const [rowsUpdated] = await Farmer.update(
{ verificationStatus: status },
{ where: { id: userId, verificationStatus: 'Pending' } }
);

if (rowsUpdated === 0) {
return errorResponse(res, 404, "User not found or status is not 'Pending'.");
}

return successResponse(res, 200, `User ID ${userId} status updated to ${status}.`);
} catch (error) {
console.error('Error updating verification status:', error);
return errorResponse(res, 500, "Failed to update user verification status.");
}
};

export const blockUser = async (req, res) => {
const { userId } = req.params;

try {
// Find the user to check existence before deletion
const user = await Farmer.findByPk(userId);
if (!user) {
return errorResponse(res, 404, "User not found.");
}

// Delete user and all associated listings (Cascading delete assumed in database config)
await Farmer.destroy({ where: { id: userId } });
console.log(`AUDIT: Admin deleted user ID ${userId} (${user.fullName}).`);

return successResponse(res, 200, `User ID ${userId} and all associated data have been removed.`);
} catch (error) {
console.error('Error blocking user:', error);
return errorResponse(res, 500, "Failed to remove user.");
}
};
export const removeListing = async (req, res) => {
const { listingId } = req.params;

try {
const rowsDeleted = await Produce.destroy({ where: { id: listingId } });

if (rowsDeleted === 0) {
return errorResponse(res, 404, "Listing not found.");
}

return successResponse(res, 200, `Listing ID ${listingId} has been removed.`);
} catch (error) {
console.error('Error removing listing:', error);
return errorResponse(res, 500, "Failed to remove listing.");
}
};

export const getAdminSummary = async (req, res) => {
try {
const totalFarmers = await Farmer.count({ where: { role: 'Farmer' } });
const totalBuyers = await Farmer.count({ where: { role: 'Buyer' } });
const activeListings = await Produce.count({ where: { status: 'Active' } });
const pendingVerifications = await Farmer.count({ where: { verificationStatus: 'Pending' } });

return successResponse(res, 200, "Admin summary retrieved.", {
totalFarmers,
totalBuyers,
activeListings,
pendingVerifications,
});
} catch (error) {
console.error('Error fetching admin summary:', error);
return errorResponse(res, 500, "Failed to load admin summary data.");
}
};

// Export all controller functions
export default {
getPendingVerifications,
updateVerificationStatus,
blockUser,
removeListing,
getAdminSummary,
};