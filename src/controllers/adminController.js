import models from "../models/index.js";
import User from "../models/user.js";
import AppError from "../utils/AppError.js";

const { Farmer, Produce } = models;

const getPendingVerifications = async (req, res) => {
  try {
    const pendingFarmers = await Farmer.findAll({
      where: { verificationStatus: "Pending" },
      include: [
        {
          model: User,
          attributes: [
            "user_uuid",
            "firstName",
            "lastName",
            "email",
            "phoneNumber",
            "createdAt",
          ],
        },
      ],
      order: [["createdAt", "ASC"]],
    });

    res.status(200).json({
      success: true,
      message: "Pending verifications retrieved successfully",
      data: pendingFarmers,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to retrieve pending verifications",
    });
  }
};

const updateVerificationStatus = async (req, res) => {
  try {
    const { userId, status } = req.body;

    if (status !== "Verified" && status !== "Rejected") {
      throw new AppError(
        "Invalid status provided. Must be 'Verified' or 'Rejected'",
        400
      );
    }

    const farmer = await Farmer.findOne({
      where: { userId, verificationStatus: "Pending" },
    });

    if (!farmer) {
      throw new AppError("Farmer not found or status is not 'Pending'", 404);
    }

    await farmer.update({ verificationStatus: status });

    res.status(200).json({
      success: true,
      message: `Farmer verification status updated to ${status}`,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to update verification status",
    });
  }
};

const blockUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByPk(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    await User.destroy({ where: { user_uuid: userId } });

    res.status(200).json({
      success: true,
      message: `User ${userId} and all associated data have been removed`,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to remove user",
    });
  }
};

const removeListing = async (req, res) => {
  try {
    const { listingId } = req.params;

    const rowsDeleted = await Produce.destroy({ where: { id: listingId } });

    if (rowsDeleted === 0) {
      throw new AppError("Listing not found", 404);
    }

    res.status(200).json({
      success: true,
      message: `Listing ${listingId} has been removed`,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to remove listing",
    });
  }
};

const getAdminSummary = async (req, res) => {
  try {
    const totalFarmers = await User.count({ where: { role: "farmer" } });
    const totalCustomers = await User.count({ where: { role: "customer" } });
    const activeListings = await Produce.count({ where: { status: "Active" } });
    const pendingVerifications = await Farmer.count({
      where: { verificationStatus: "Pending" },
    });

    res.status(200).json({
      success: true,
      message: "Admin summary retrieved",
      data: {
        totalFarmers,
        totalCustomers,
        activeListings,
        pendingVerifications,
      },
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      success: false,
      message: error.message || "Failed to load admin summary data",
    });
  }
};

export {
  getPendingVerifications,
  updateVerificationStatus,
  blockUser,
  removeListing,
  getAdminSummary,
};
