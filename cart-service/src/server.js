require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const cartRoutes = require("./routes/cart.routes");

const app = express();

// ✅ CORS (IMPORTANT)
app.use(
  cors({
    origin: ["http://localhost:8080", "https://luxe-shop-frontend.vercel.app"],
    credentials: true,
  }),
);

app.use(express.json());

// LOGGER
app.use((req, res, next) => {
  console.log("🛒 CART:", req.method, req.url);
  next();
});

// DB
connectDB();

// ROUTES
app.use("/", cartRoutes);

// TEST
app.get("/", (req, res) => {
  res.send("Cart Service Running 🚀");
});

app.listen(process.env.PORT, () => {
  console.log(`Cart service running on ${process.env.PORT}`);
});
