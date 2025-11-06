import models from "../models/index.js";
import AppError from "../utils/AppError.js";

const { Farmer, Produce } = models;

async function getPendingVerifications(req, res) {
  try {
    const pendingUsers = await Farmer.findAll({
      where: { verificationStatus: "Pending" },
      attributes: [
        "id",
        "fullName",
        "nin",
        "phone",
        "role",
        "createdAt",
        "location",
      ],
      order: [["createdAt", "ASC"]],
    });

    res.status(200).json({
      success: true,
      message: "Pending users retrieved successfully",
      data: pendingUsers,
    });
  } catch (error) {
    throw new AppError(
      error.message || "Failed to retrieve pending verifications",
      500
    );
  }
}

async function updateVerificationStatus(req, res) {
  try {
    const userId = req.body.userId;
    const status = req.body.status;

    if (status !== "Verified" && status !== "Rejected") {
      throw new AppError(
        "Invalid status provided. Must be 'Verified' or 'Rejected'",
        400
      );
    }

    const result = await Farmer.update(
      { verificationStatus: status },
      { where: { id: userId, verificationStatus: "Pending" } }
    );

    const rowsUpdated = result[0];

    if (rowsUpdated === 0) {
      throw new AppError("User not found or status is not 'Pending'", 404);
    }

    res.status(200).json({
      success: true,
      message: `User ID ${userId} status updated to ${status}`,
    });
  } catch (error) {
    throw new AppError(
      error.message || "Failed to update user verification status",
      500
    );
  }
}

async function blockUser(req, res) {
  try {
    const userId = req.params.userId;

    // Find the user to check existence before deletion
    const user = await Farmer.findByPk(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    // Delete user and all associated listings (Cascading delete assumed in database config)
    await Farmer.destroy({ where: { id: userId } });
    console.log(`AUDIT: Admin deleted user ID ${userId} (${user.fullName}).`);

    res.status(200).json({
      success: true,
      message: `User ID ${userId} and all associated data have been removed`,
    });
  } catch (error) {
    throw new AppError(error.message || "Failed to remove user", 500);
  }
}
async function removeListing(req, res) {
  try {
    const listingId = req.params.listingId;

    const rowsDeleted = await Produce.destroy({ where: { id: listingId } });

    if (rowsDeleted === 0) {
      throw new AppError("Listing not found", 404);
    }

    res.status(200).json({
      success: true,
      message: `Listing ID ${listingId} has been removed`,
    });
  } catch (error) {
    throw new AppError(error.message || "Failed to remove listing", 500);
  }
}

async function getAdminSummary(req, res) {
  try {
    const totalFarmers = await Farmer.count({ where: { role: "Farmer" } });
    const totalBuyers = await Farmer.count({ where: { role: "Buyer" } });
    const activeListings = await Produce.count({ where: { status: "Active" } });
    const pendingVerifications = await Farmer.count({
      where: { verificationStatus: "Pending" },
    });

    res.status(200).json({
      success: true,
      message: "Admin summary retrieved",
      data: {
        totalFarmers: totalFarmers,
        totalBuyers: totalBuyers,
        activeListings: activeListings,
        pendingVerifications: pendingVerifications,
      },
    });
  } catch (error) {
    throw new AppError(
      error.message || "Failed to load admin summary data",
      500
    );
  }
}

export {
  getPendingVerifications,
  updateVerificationStatus,
  blockUser,
  removeListing,
  getAdminSummary,
};
