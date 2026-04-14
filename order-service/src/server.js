require("dotenv").config();

const express = require("express");
const cors = require("cors");
const sequelize = require("./config/db");

const Order = require("./models/Order");
const OrderItem = require("./models/OrderItem");

const orderRoutes = require("./routes/order.routes");

const app = express();

app.use(
  cors({
    origin: "http://localhost:8080",
    credentials: true,
  }),
);
app.use(express.json());

// LOGGER
app.use((req, res, next) => {
  console.log("🛒 ORDER:", req.method, req.url);
  next();
});

// RELATIONS
Order.hasMany(OrderItem, { onDelete: "CASCADE" });
OrderItem.belongsTo(Order);

// DB SYNC
sequelize.sync();

// ROUTES
app.use("/api/orders", orderRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Order service running on ${process.env.PORT}`);
});
