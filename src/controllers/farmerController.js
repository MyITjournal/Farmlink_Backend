import Produce from "../models/produce.js";
import Farmer from "../models/farmer.js";
import AppError from "../utils/AppError.js";

export async function addProduct(req, res, next) {
  try {
    const { productName, pricePerUnit, quantity, category, description, harvestDate } = req.body;
    const farmerUuid = req.user.user_uuid || req.user.id;

    if (!productName || !pricePerUnit || !quantity) return next(new AppError("Product name, price and quantity are required", 400));
    const price = parseFloat(pricePerUnit);
    const qty = parseFloat(quantity);
    if (Number.isNaN(price) || Number.isNaN(qty)) return next(new AppError("Price and quantity must be valid numbers", 400));

    const newProduct = await Produce.create({ farmer_uuid: farmerUuid, productName, pricePerUnit: price, quantity: qty, category, description, harvestDate, status: "Active" });
    return res.status(201).json({ success: true, message: "Product added successfully", data: newProduct });
  } catch (error) {
    return next(new AppError(error.message || "Server error", 500));
  }
}

export async function editProduct(req, res, next) {
  try {
    const { id } = req.params;
    const farmerUuid = req.user.user_uuid || req.user.id;
    const product = await Produce.findOne({ where: { id, farmer_uuid: farmerUuid } });
    if (!product) return next(new AppError("Product not found", 404));

    const { productName, pricePerUnit, quantity, category, description, harvestDate } = req.body;
    if (productName) product.productName = productName;
    if (pricePerUnit) {
      const price = parseFloat(pricePerUnit);
      if (Number.isNaN(price)) return next(new AppError("Invalid price", 400));
      product.pricePerUnit = price;
    }
    if (quantity) {
      const qty = parseFloat(quantity);
      if (Number.isNaN(qty)) return next(new AppError("Invalid quantity", 400));
      product.quantity = qty;
    }
    if (category) product.category = category;
    if (description) product.description = description;
    if (harvestDate) product.harvestDate = harvestDate;

    await product.save();
    return res.status(200).json({ success: true, message: "Product updated successfully", data: product });
  } catch (error) {
    return next(new AppError(error.message || "Server error", 500));
  }
}

export async function toggleProductStatus(req, res, next) {
  try {
    const { id } = req.params;
    const farmerUuid = req.user.user_uuid || req.user.id;
    const product = await Produce.findOne({ where: { id, farmer_uuid: farmerUuid } });
    if (!product) return next(new AppError("Product not found", 404));
    product.status = product.status === "Active" ? "Inactive" : "Active";
    await product.save();
    return res.status(200).json({ success: true, message: `Product status changed to ${product.status}`, data: product });
  } catch (error) {
    return next(new AppError(error.message || "Server error", 500));
  }
}

export async function getFarmerDashboard(req, res, next) {
  try {
    const farmerUuid = req.user.user_uuid || req.user.id;
    const farmer = await Farmer.findByPk(farmerUuid, { attributes: ["user_uuid", "farmName"] });
    if (!farmer) return next(new AppError("Farmer not found", 404));
    const products = await Produce.findAll({ where: { farmer_uuid: farmerUuid }, order: [["createdAt", "DESC"]] });
    const totalProducts = products.length;
    const activeProducts = products.filter((p) => p.status === "Active").length;
    return res.status(200).json({ success: true, message: "Dashboard loaded", data: { farmer, products, stats: { totalProducts, activeProducts } } });
  } catch (error) {
    return next(new AppError(error.message || "Server error", 500));
  }
}

export async function getAllFarmers(req, res, next) {
  try {
    const farmers = await Farmer.findAll({ attributes: { exclude: [] }, order: [["createdAt", "DESC"]] });
    return res.status(200).json({ success: true, message: "Farmers retrieved", data: farmers });
  } catch (error) {
    return next(new AppError(error.message || "Unable to fetch farmers", 500));
  }
}
