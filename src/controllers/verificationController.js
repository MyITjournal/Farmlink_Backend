import crypto from "crypto";
import Verification from "../models/verification.js";
import Customer from "../models/customer.js";
import responseHandler from "../utils/responseHandler.js";

const { successResponse, errorResponse } = responseHandler;
const DEFAULT_EXPIRY_MINUTES = 30;

export const requestVerification = async (req, res) => {
	try {
		const { customerId, type } = req.body || {};

		if (!customerId || !type) {
			return errorResponse(res, "customerId and type are required", 400);
		}

		const customer = await Customer.findByPk(customerId, {
			attributes: ["id", "fullName", "email"],
		});

		if (!customer) {
			return errorResponse(res, "Customer not found", 404);
		}

		await Verification.update(
			{ used: true },
			{ where: { customerId, type, used: false } }
		);

		const token = crypto.randomBytes(24).toString("hex");
		const expiresAt = new Date(Date.now() + DEFAULT_EXPIRY_MINUTES * 60000);

		const verification = await Verification.create({
			customerId,
			token,
			type,
			expiresAt,
		});

		return successResponse(res, "Verification token created", {
			token: verification.token,
			expiresAt: verification.expiresAt,
		}, 201);
	} catch (error) {
		console.error("Error creating verification token:", error);
		return errorResponse(
			res,
			"Unable to create verification token",
			500,
			error.message
		);
	}
};

export const verifyToken = async (req, res) => {
	try {
		const { token } = req.body || {};

		if (!token) {
			return errorResponse(res, "token is required", 400);
		}

		const verification = await Verification.findOne({
			where: { token },
			include: {
				model: Customer,
				attributes: ["id", "fullName", "email", "accountStatus"],
			},
		});

		if (!verification) {
			return errorResponse(res, "Token not found", 404);
		}

		if (verification.used) {
			return errorResponse(res, "Token already used", 400);
		}

		if (verification.expiresAt < new Date()) {
			return errorResponse(res, "Token has expired", 400);
		}

		verification.used = true;
		await verification.save();

		return successResponse(res, "Token verified", {
			customer: verification.Customer,
			type: verification.type,
		});
	} catch (error) {
		console.error("Error verifying token:", error);
		return errorResponse(res, "Unable to verify token", 500, error.message);
	}
};

export const getCustomerVerifications = async (req, res) => {
	try {
		const { customerId } = req.params;

		const verifications = await Verification.findAll({
			where: { customerId },
			order: [["createdAt", "DESC"]],
		});

		if (!verifications.length) {
			return errorResponse(res, "No verifications found", 404);
		}

		return successResponse(res, "Verifications retrieved", verifications);
	} catch (error) {
		console.error("Error fetching verifications:", error);
		return errorResponse(res, "Unable to fetch verifications", 500, error.message);
	}
};

export default {
	requestVerification,
	verifyToken,
	getCustomerVerifications,
};
