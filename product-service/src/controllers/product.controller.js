const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");

// CREATE PRODUCT
exports.createProduct = async (req, res) => {
  try {
    let imageUrls = [];

    if (req.files) {
      for (let file of req.files) {
        const result = await cloudinary.uploader.upload(
          `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
        );
        imageUrls.push(result.secure_url);
      }
    }

    const product = await Product.create({
      ...req.body,
      images: imageUrls,
      createdBy: req.user.id,
    });

    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// GET ALL
exports.getProducts = async (req, res) => {
  try {
    const { category } = req.query;

    let filter = {};

    if (category) {
      filter.category = category;
    }

    const products = await Product.find(filter);

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ONE
exports.getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.json(product);
};

// UPDATE
exports.updateProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(product);
};

// DELETE
exports.deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ msg: "Deleted" });
};

exports.reduceStock = async (req, res) => {
  try {
    const { items } = req.body;

    for (let item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          msg: `Product not found: ${item.productId}`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          msg: `Not enough stock for ${product.name}`,
        });
      }

      product.stock -= item.quantity;
      await product.save();
    }

    res.json({ message: "Stock updated ✅" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.restoreStock = async (req, res) => {
  try {
    const { items } = req.body;

    for (let item of items) {
      const product = await Product.findById(item.productId);

      if (!product) continue;

      product.stock += item.quantity;
      await product.save();
    }

    res.json({ message: "Stock restored ✅" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
