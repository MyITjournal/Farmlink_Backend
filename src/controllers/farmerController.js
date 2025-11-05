import Produce from "../models/produce.js";
import Farmer from "../models/farmer.js";
import AppError from "../utils/AppError.js";

// Adding a new product
async function addProduct(req, res) {
  try {
    const { productName, pricePerUnit, quantity } = req.body;
    const farmerId = req.user.id;

    if (!productName || !pricePerUnit || !quantity) {
      throw new AppError("Product name, price, and quantity are required", 400);
    }

    const newProduct = await Produce.create({
      farmerId,
      productName,
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
    const farmerId = req.user.id;

    const product = await Produce.findOne({
      where: { id, farmerId },
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
    const farmerId = req.user.id;

    const product = await Produce.findOne({
      where: { id, farmerId },
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
    const farmerId = req.user.id;

    const farmer = await Farmer.findByPk(farmerId);
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
          id: farmer.id,
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

export {
  addProduct,
  editProduct,
  toggleProductStatus,
  getFarmerDashboard,
};
