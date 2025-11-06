import Customer from "../models/customer.js";
import AppError from "../utils/AppError.js";

async function getAllCustomers(req, res) {
  try {
    const customers = await Customer.findAll({
      attributes: { exclude: ["password"] },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      message: "Customers retrieved successfully",
      data: customers,
    });
  } catch (error) {
    throw new AppError(error.message || "Unable to fetch customers", 500);
  }
}

async function getCustomerById(req, res) {
  try {
    const id = req.params.id;
    const customer = await Customer.findByPk(id, {
      attributes: { exclude: ["password"] },
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
    throw new AppError(error.message || "Unable to fetch customer", 500);
  }
}

async function updateCustomer(req, res) {
  try {
    const id = req.params.id;
    const updateFields = req.body;
    delete updateFields.password;

    const result = await Customer.update(updateFields, {
      where: { id },
      returning: true,
      individualHooks: true,
    });

    const rowsUpdated = result[0];
    const updatedCustomer = result[1][0];

    if (rowsUpdated === 0) {
      throw new AppError("Customer not found", 404);
    }

    const customerData = updatedCustomer.get({ plain: true });
    delete customerData.password;

    res.status(200).json({
      success: true,
      message: "Customer updated successfully",
      data: customerData,
    });
  } catch (error) {
    throw new AppError(error.message || "Unable to update customer", 500);
  }
}

async function deleteCustomer(req, res) {
  try {
    const id = req.params.id;
    const deleted = await Customer.destroy({ where: { id } });

    if (!deleted) {
      throw new AppError("Customer not found", 404);
    }

    res.status(200).json({
      success: true,
      message: "Customer deleted successfully",
      data: { id },
    });
  } catch (error) {
    throw new AppError(error.message || "Unable to delete customer", 500);
  }
}

export { getAllCustomers, getCustomerById, updateCustomer, deleteCustomer };
