import Customer from "../models/customer.js";
import AppError from "../utils/AppError.js";

export async function getAllCustomers(req, res, next) {
  try {
    const customers = await Customer.findAll({ attributes: { exclude: ["password"] }, order: [["createdAt", "DESC"]] });
    return res.status(200).json({ success: true, message: "Customers retrieved successfully", data: customers });
  } catch (error) {
    return next(new AppError(error.message || "Unable to fetch customers", 500));
  }
}

export async function getCustomerById(req, res, next) {
  try {
    const { id } = req.params;
    const customer = await Customer.findByPk(id);
    if (!customer) return next(new AppError("Customer not found", 404));
    return res.status(200).json({ success: true, message: "Customer retrieved successfully", data: customer });
  } catch (error) {
    return next(new AppError(error.message || "Unable to fetch customer", 500));
  }
}

export async function updateCustomer(req, res, next) {
  try {
    const { id } = req.params;
    const allowedFields = ["firstName", "lastName", "phoneNumber", "address", "city", "state", "profilePicture"];
    const updateData = {};
    for (const f of allowedFields) if (req.body[f] !== undefined) updateData[f] = req.body[f];
    const [rowsUpdated, [updatedCustomer]] = await Customer.update(updateData, { where: { user_uuid: id }, returning: true });
    if (rowsUpdated === 0) return next(new AppError("Customer not found", 404));
    const data = updatedCustomer.get ? updatedCustomer.get({ plain: true }) : updatedCustomer;
    delete data.password;
    return res.status(200).json({ success: true, message: "Customer updated successfully", data });
  } catch (error) {
    return next(new AppError(error.message || "Unable to update customer", 500));
  }
}

export async function deleteCustomer(req, res, next) {
  try {
    const { id } = req.params;
    const deleted = await Customer.destroy({ where: { user_uuid: id } });
    if (!deleted) return next(new AppError("Customer not found", 404));
    return res.status(200).json({ success: true, message: "Customer deleted successfully", data: { id } });
  } catch (error) {
    return next(new AppError(error.message || "Unable to delete customer", 500));
  }
}
