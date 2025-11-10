import Produce from "../models/produce.js";
import Farmer from "../models/farmer.js";
import AppError from "../utils/AppError.js";

// Adding a new product
async function addProduct(req, res) {
  try {
    const { productName, pricePerUnit, quantity, category } = req.body;
    const userId = req.user.userId;

    if (!productName || !pricePerUnit || !quantity) {
      throw new AppError("Product name, price, and quantity are required", 400);
    }

    const newProduct = await Produce.create({
      userId,
      productName,
      category,
      pricePerUnit: parseFloat(pricePerUnit),
      quantity: parseInt(quantity),
      status: "Active",
    });

    return res.status(201).json({
      success: true,
      message: "Product added successfully",
      data: newProduct,
    });
  } catch (error) {
    throw new AppError(error.message || "Server error", 500);
  }
}

// Editing an already existing product
async function editProduct(req, res) {
  try {
    const { id } = req.params;
    const { productName, pricePerUnit, quantity } = req.body;
    const userId = req.user.userId;

    const product = await Produce.findOne({
      where: { id, userId },
    });

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    if (productName) product.productName = productName;
    if (pricePerUnit) product.pricePerUnit = parseFloat(pricePerUnit);
    if (quantity) product.quantity = parseInt(quantity);

    await product.save();

    res.json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    throw new AppError(error.message || "Server error", 500);
  }
}

// To know the status of each product
async function toggleProductStatus(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const product = await Produce.findOne({
      where: { id, userId },
    });

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    if (product.status === "Active") {
      product.status = "Inactive";
    } else {
      product.status = "Active";
    }
    await product.save();

    res.json({
      success: true,
      message: `Product status changed to ${product.status}`,
      data: product,
    });
  } catch (error) {
    throw new AppError(error.message || "Server error", 500);
  }
}

// Merged farmer dashboard
async function getFarmerDashboard(req, res) {
  try {
    const userId = req.user.userId;

    const farmer = await Farmer.findByPk(userId);
    if (!farmer) {
      throw new AppError("Farmer not found", 404);
    }

    const products = await Produce.findAll({
      where: { farmerId },
      order: [["createdAt", "DESC"]],
    });

    const totalProducts = products.length;
    const activeProducts = products.filter((p) => p.status === "Active").length;

    res.json({
      success: true,
      message: "Dashboard loaded successfully",
      data: {
        farmer: {
          id: user.id,
          fullName: farmer.fullName,
        },
        products,
        stats: {
          totalProducts,
          activeProducts,
        },
      },
    });
  } catch (error) {
    throw new AppError(error.message || "Server error", 500);
  }
}

// Get all farmers
async function getAllFarmers(req, res) {
  try {
    const farmers = await Farmer.findAll({
      order: [["createdAt", "DESC"]],
    });
    const totalFarmers = farmers.length;
    res.status(200).json({
      success: true,
      message: "Farmers retrieved successfully",
      total: totalFarmers,
      data: farmers,
    });
  } catch (error) {
    throw new AppError(error.message || "Unable to fetch farmers", 500);
  }
}

export {
  addProduct,
  editProduct,
  toggleProductStatus,
  getFarmerDashboard,
  getAllFarmers,
};
