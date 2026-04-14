require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const productRoutes = require("./routes/product.routes");

const app = express();

app.use(
  cors({
    origin: "http://localhost:8080",
    credentials: true,
  }),
);
app.use(express.json());

// ✅ FIXED LOGGER
app.use((req, res, next) => {
  console.log("📦 PRODUCT:", req.method, req.url);
  next();
});

// DB
connectDB();

// Routes
app.use("/api/products", productRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Product service running on ${process.env.PORT}`);
});
