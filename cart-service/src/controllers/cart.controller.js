const Cart = require("../models/Cart");

// 🛒 GET CART
exports.getCart = async (req, res) => {
  const userId = req.user.id;

  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = await Cart.create({ userId, items: [] });
  }

  res.json(cart);
};

// ➕ ADD TO CART
exports.addToCart = async (req, res) => {
  const userId = req.user.id;
  const { productId, quantity = 1 } = req.body;

  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = await Cart.create({ userId, items: [] });
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.productId.toString() === productId,
  );

  if (itemIndex > -1) {
    cart.items[itemIndex].quantity += quantity;
  } else {
    cart.items.push({ productId, quantity });
  }

  await cart.save();

  res.json(cart);
};

// 🔄 UPDATE QUANTITY
exports.updateCartItem = async (req, res) => {
  const userId = req.user.id;
  const { productId, quantity } = req.body;

  const cart = await Cart.findOne({ userId });

  const item = cart.items.find((i) => i.productId.toString() === productId);

  if (!item) {
    return res.status(404).json({ message: "Item not found" });
  }

  item.quantity = quantity;

  await cart.save();

  res.json(cart);
};

// ❌ REMOVE ITEM
exports.removeItem = async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.params;

  const cart = await Cart.findOne({ userId });

  cart.items = cart.items.filter(
    (item) => item.productId.toString() !== productId,
  );

  await cart.save();

  res.json(cart);
};

// 🧹 CLEAR CART
exports.clearCart = async (req, res) => {
  const userId = req.user.id;

  await Cart.findOneAndUpdate({ userId }, { items: [] });

  res.json({ message: "Cart cleared" });
};
