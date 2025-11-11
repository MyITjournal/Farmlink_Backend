import Customer from "../models/customer.js";
import User from "../models/user.js";
import AppError from "../utils/AppError.js";

const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.findAll({
      include: [
        {
          model: User,
          attributes: [
            "user_uuid",
            "firstName",
            "lastName",
            "email",
            "phoneNumber",
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      message: "Customers retrieved successfully",
      data: customers,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || "Unable to fetch customers",
    });
  }
};

const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findOne({
      where: { userId: id },
      include: [
        {
          model: User,
          attributes: [
            "user_uuid",
            "firstName",
            "lastName",
            "email",
            "phoneNumber",
          ],
        },
      ],
    });

    if (!customer) {
      throw new AppError("Customer not found", 404);
    }

    res.status(200).json({
      success: true,
      message: "Customer retrieved successfully",
      data: customer,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || "Unable to fetch customer",
    });
  }
};

const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const updateFields = req.body;

    const customer = await Customer.findOne({ where: { userId: id } });

    if (!customer) {
      throw new AppError("Customer not found", 404);
    }

    await customer.update(updateFields);

    res.status(200).json({
      success: true,
      message: "Customer updated successfully",
      data: customer,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || "Unable to update customer",
    });
  }
};

const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Customer.destroy({ where: { userId: id } });

    if (!deleted) {
      throw new AppError("Customer not found", 404);
    }

    res.status(200).json({
      success: true,
      message: "Customer deleted successfully",
      data: { id },
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || "Unable to delete customer",
    });
  }
};

export { getAllCustomers, getCustomerById, updateCustomer, deleteCustomer };
