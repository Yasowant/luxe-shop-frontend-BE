const axios = require("axios");
const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const sequelize = require("../config/db");

exports.createOrder = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { items, totalAmount } = req.body;

    // 🔥 STEP 1: CALL PRODUCT SERVICE
    await axios.put(
      "http://localhost:4002/api/products/reduce-stock",
      { items },
      {
        headers: {
          Authorization: req.headers.authorization, // forward token
        },
      },
    );

    // 🔥 STEP 2: CREATE ORDER
    const order = await Order.create(
      {
        userId: req.user.id,
        totalAmount,
      },
      { transaction: t },
    );

    for (let item of items) {
      await OrderItem.create(
        {
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          OrderId: order.id,
        },
        { transaction: t },
      );
    }

    await t.commit();

    res.status(201).json({
      message: "Order created + stock reduced ✅",
      orderId: order.id,
    });
  } catch (err) {
    await t.rollback();

    console.error("ORDER ERROR:", err.message);

    res.status(500).json({
      error: err.response?.data || err.message,
    });
  }
};

// GET MY ORDERS
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      include: OrderItem,
    });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET SINGLE ORDER
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: OrderItem,
    });

    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.cancelOrder = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const order = await Order.findByPk(req.params.id, {
      include: OrderItem,
    });

    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    // ✅ Only owner
    if (order.userId !== req.user.id) {
      return res.status(403).json({ msg: "Not allowed" });
    }

    // ❌ Already cancelled
    if (order.status === "cancelled") {
      return res.status(400).json({ msg: "Order already cancelled" });
    }

    // ❌ Already delivered
    if (order.status === "delivered") {
      return res.status(400).json({
        msg: "Delivered order cannot be cancelled",
      });
    }

    // 🔥 STEP 1: RESTORE STOCK
    const items = order.OrderItems.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    }));

    await require("axios").put(
      "http://localhost:4002/api/products/restore-stock",
      { items },
      {
        headers: {
          Authorization: req.headers.authorization,
        },
      },
    );

    // 🔥 STEP 2: UPDATE STATUS
    order.status = "cancelled";
    await order.save({ transaction: t });

    await t.commit();

    res.json({
      message: "Order cancelled + stock restored ✅",
    });
  } catch (err) {
    await t.rollback();

    res.status(500).json({
      error: err.response?.data || err.message,
    });
  }
};
