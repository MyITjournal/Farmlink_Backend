import Customer from "../models/customer.js";
import { successResponse ,errorResponse } from "../utils/responseHandler.js";


export const getCustomers = async (req, res) => {
	try {
		const customers = await Customer.findAll({
			attributes: { exclude: ["password"] },
			order: [["createdAt", "DESC"]],
		});

		return successResponse(res, "Customers retrieved", customers);
	} catch (error) {
		console.error("Error fetching customers:", error);
		return errorResponse(res, "Unable to fetch customers", 500, error.message);
	}
};

export const getCustomerById = async (req, res) => {
	try {
		const { id } = req.params;
		const customer = await Customer.findByPk(id, {
			attributes: { exclude: ["password"] },
		});

		if (!customer) {
			return errorResponse(res, "Customer not found", 404);
		}

		return successResponse(res, "Customer retrieved", customer);
	} catch (error) {
		console.error("Error fetching customer:", error);
		return errorResponse(res, "Unable to fetch customer", 500, error.message);
	}
};

export const updateCustomer = async (req, res) => {
	try {
		const { id } = req.params;
		const updateFields = { ...req.body };
		delete updateFields.password;

		const [rowsUpdated, [updatedCustomer]] = await Customer.update(
			updateFields,
			{
				where: { id },
				returning: true,
				individualHooks: true,
			}
		);

		if (rowsUpdated === 0) {
			return errorResponse(res, "Customer not found", 404);
		}

		const { password, ...publicCustomer } = updatedCustomer.get({ plain: true });

		return successResponse(res, "Customer updated", publicCustomer);
	} catch (error) {
		console.error("Error updating customer:", error);
		return errorResponse(res, "Unable to update customer", 500, error.message);
	}
};

export const deleteCustomer = async (req, res) => {
	try {
		const { id } = req.params;
		const deleted = await Customer.destroy({ where: { id } });

		if (!deleted) {
			return errorResponse(res, "Customer not found", 404);
		}

		return successResponse(res, "Customer deleted", { id });
	} catch (error) {
		console.error("Error deleting customer:", error);
		return errorResponse(res, "Unable to delete customer", 500, error.message);
	}
};

export default {
	getCustomers,
	getCustomerById,
	updateCustomer,
	deleteCustomer,
};
