import models from "../models/index.js";
import AppError from "../utils/AppError.js";

const { Farmer, Produce } = models;

export async function getPendingVerifications(req, res, next) {
  try {
    const pendingUsers = await Farmer.findAll({
      where: { verificationStatus: "Pending" },
      attributes: ["user_uuid", "farmName", "verificationStatus", "createdAt"],
      order: [["createdAt", "ASC"]],
    });
    return res.status(200).json({ success: true, message: "Pending users retrieved", data: pendingUsers });
  } catch (error) {
    return next(new AppError(error.message || "Failed to retrieve pending verifications", 500));
  }
}

export async function updateVerificationStatus(req, res, next) {
  try {
    const { farmerUuid, status } = req.body;
    if (!["Verified", "Rejected"].includes(status)) return next(new AppError("Invalid status provided", 400));
    const [updated] = await Farmer.update({ verificationStatus: status }, { where: { user_uuid: farmerUuid, verificationStatus: "Pending" } });
    if (updated === 0) return next(new AppError("Farmer not found or status not pending", 404));
    return res.status(200).json({ success: true, message: `Farmer ${farmerUuid} status updated to ${status}` });
  } catch (error) {
    return next(new AppError(error.message || "Failed to update verification status", 500));
  }
}

export async function blockUser(req, res, next) {
  try {
    const { userUuid } = req.params;
    const farmer = await Farmer.findByPk(userUuid);
    if (!farmer) return next(new AppError("User not found", 404));
    await Farmer.update({ isBlocked: true }, { where: { user_uuid: userUuid } });
    console.log(`AUDIT: Admin blocked user ${userUuid}`);
    return res.status(200).json({ success: true, message: `User ${userUuid} has been blocked` });
  } catch (error) {
    return next(new AppError(error.message || "Failed to block user", 500));
  }
}

export async function removeListing(req, res, next) {
  try {
    const { listingId } = req.params;
    const deleted = await Produce.destroy({ where: { id: listingId } });
    if (deleted === 0) return next(new AppError("Listing not found", 404));
    return res.status(200).json({ success: true, message: `Listing ${listingId} removed` });
  } catch (error) {
    return next(new AppError(error.message || "Failed to remove listing", 500));
  }
}

export async function getAdminSummary(req, res, next) {
  try {
    const [totalFarmers, totalCustomers, activeListings, pendingVerifications] = await Promise.all([
      Farmer.count(),
      (await models.Customer.count()),
      Produce.count({ where: { status: "Active" } }),
      Farmer.count({ where: { verificationStatus: "Pending" } }),
    ]);
    return res.status(200).json({ success: true, message: "Admin summary retrieved", data: { totalFarmers, totalCustomers, activeListings, pendingVerifications } });
  } catch (error) {
    return next(new AppError(error.message || "Failed to load admin summary", 500));
  }
}
