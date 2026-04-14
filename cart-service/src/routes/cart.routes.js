const express = require("express");
const router = express.Router();


const {
  getCart,
  addToCart,
  updateCartItem,
  removeItem,
  clearCart,
} = require("../controllers/cart.controller");
const { protect } = require("../../../common");

// 🛒 ROUTES
router.get("/", protect, getCart);
router.post("/add", protect, addToCart);
router.put("/update", protect, updateCartItem);
router.delete("/remove/:productId", protect, removeItem);
router.delete("/clear", protect, clearCart);

module.exports = router;
