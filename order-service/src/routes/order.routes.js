const router = require("express").Router();

const {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
} = require("../controllers/order.controller");

const { protect } = require("../middleware/auth.middleware");

// CREATE ORDER
router.post("/", protect, createOrder);

// GET MY ORDERS
router.get("/my", protect, getMyOrders);

// GET SINGLE ORDER
router.get("/:id", protect, getOrderById);

router.put("/:id/cancel", protect, cancelOrder);

module.exports = router;
