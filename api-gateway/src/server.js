require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

app.use(
  cors({
    origin: "http://localhost:8080",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.use((req, res, next) => {
  console.log("🌐 Gateway:", req.method, req.url);
  next();
});

// ✅ AUTH SERVICE (FIXED WITH ENV)
app.use(
  "/api/auth",
  createProxyMiddleware({
    target: `${process.env.AUTH_SERVICE_URL}/api/auth`,
    changeOrigin: true,
  }),
);

// ✅ PRODUCT SERVICE (FIXED WITH ENV)
app.use(
  "/api/products",
  createProxyMiddleware({
    target: `${process.env.PRODUCT_SERVICE_URL}/api/products`,
    changeOrigin: true,
  }),
);

app.use(
  "/api/orders",
  createProxyMiddleware({
    target: `${process.env.ORDER_SERVICE_URL}/api/orders`,
    changeOrigin: true,
  }),
);

app.use(
  "/api/cart",
  createProxyMiddleware({
    target: `${process.env.CART_SERVICE_URL}/api/cart`,
    changeOrigin: true,
  }),
);

app.listen(process.env.PORT || 4000, () => {
  console.log(`🚀 Gateway running on ${process.env.PORT}`);
});
