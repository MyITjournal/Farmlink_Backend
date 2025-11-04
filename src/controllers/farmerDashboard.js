import Produce from "../models/produce";
import Farmer from "../models/farmer";
export async function getFarmerDashboard(req, res) {
  try {
    const { farmerId } = req.params;
    const farmer = await Farmer.findByPk(farmerId, { include: Produce });
    if (!farmer) {
      return res.status(404).send("Farmer not found.");
    }

    const totalProducts = farmer.Produce.length;
    const activeProducts = farmer.Produce.filter(
      (p) => p.status === "Active"
    ).length;
    const averagePrice =
      farmer.Produce.reduce((sum, p) => sum + p.price, 0) /
      (totalProducts || 1);

    res.status(200).json({
      message: `Welcome, ${farmer.fullName}`,
      verified: farmer.verified,
      products: farmer.Produce,
      insights: { totalProducts, activeProducts, averagePrice },
    });
  } catch (err) {
    console.error(err, "Error fetching dashboard.");
    res.status(500).json({ message: "Server error" });
  }
}

export async function addProduct(req, res) {
  try {
    const { productName, pricePerUnit, quantity, image } = req.body;
    const farmerId = req.user.Id;
    if (!productName || !price || !quantity) {
      return res.status(404).json({ message: "All fields are required" });
    }
    const newProduct = await Produce.create({
      farmerId,
      productName,
      pricePerUnit,
      quantity,
      image,
    });
    res
      .status(200)
      .json({ message: "product added successfully", product: newProduct });
  } catch (err) {
    console.error(err, "Error adding product");
    res.status(500).json({ message: "server error" });
  }
}

export async function editProduct(req, res) {
  try {
    const { id } = req.params;
    const { productName, pricePerUnit, quantity, image, status } = req.body;
    const product = await Produce.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }
    if (product.farmerId === req.user.id) {
      return res.status(403).json({ message: "Unauthorized user" });
    }
    await product.update({
      productName,
      pricePerUnit,
      quantity,
      image,
      status,
    });

    res.status(200).json({ message: "Product updated.", product });
  } catch (err) {
    console.error("Error updating product.", err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function toggleStatus(req, res) {
  try {
    const { id } = req.params;
    const product = await Produce.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }
    if (product.farmerId !== req.user.Id) {
      res.status(403).json({ message: "Unauthorized user." });
    }
    const newStatus = product.status === "Active" ? "Sold out" : "Active";
    await product.update({ status: newStatus });

    res.status(200).json({ message: `Product is now ${newStatus}`, product });
  } catch (err) {
    console.error("Error changing the status of the product.", err);
    res.status(500).json({ message: "Server error." });
  }
}
