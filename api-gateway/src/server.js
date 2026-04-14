require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

// ✅ CORS
app.use(
  cors({
    origin: ["http://localhost:8080", "https://luxe-shop-frontend.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

// ✅ REQUEST LOGGER
app.use((req, res, next) => {
  console.log(`🌐 Incoming Request → ${req.method} ${req.originalUrl}`);
  next();
});

// 🔥 COMMON PROXY FUNCTION
const createProxy = (name, target) =>
  createProxyMiddleware({
    target,
    changeOrigin: true,

    // 🔍 DEBUG: Request going OUT
    onProxyReq: (proxyReq, req) => {
      console.log(`➡️ [${name}] ${req.method} → ${target}${req.originalUrl}`);
    },

    // 🔍 DEBUG: Response coming BACK
    onProxyRes: (proxyRes, req) => {
      console.log(`✅ [${name}] ${proxyRes.statusCode} ← ${req.originalUrl}`);
    },

    // ❌ ERROR HANDLER
    onError: (err, req, res) => {
      console.error(`❌ [${name} ERROR]:`, err.message);
      res.status(500).json({
        message: `${name} service error`,
        error: err.message,
      });
    },
  });

// ✅ AUTH SERVICE
app.use("/api/auth", createProxy("AUTH", process.env.AUTH_SERVICE_URL));

// ✅ PRODUCT SERVICE
app.use(
  "/api/products",
  createProxy("PRODUCT", process.env.PRODUCT_SERVICE_URL),
);

// ✅ ORDER SERVICE
app.use("/api/orders", createProxy("ORDER", process.env.ORDER_SERVICE_URL));

// ✅ CART SERVICE
app.use("/api/cart", createProxy("CART", process.env.CART_SERVICE_URL));

// ✅ HEALTH CHECK
app.get("/", (req, res) => {
  res.json({
    status: "🚀 API Gateway Running",
    services: {
      auth: process.env.AUTH_SERVICE_URL,
      product: process.env.PRODUCT_SERVICE_URL,
      order: process.env.ORDER_SERVICE_URL,
      cart: process.env.CART_SERVICE_URL,
    },
  });
});

// ❌ 404 HANDLER
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
    path: req.originalUrl,
  });
});

// 🚀 START SERVER
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log("=================================");
  console.log(`🚀 Gateway running on PORT ${PORT}`);
  console.log("AUTH:", process.env.AUTH_SERVICE_URL);
  console.log("PRODUCT:", process.env.PRODUCT_SERVICE_URL);
  console.log("ORDER:", process.env.ORDER_SERVICE_URL);
  console.log("CART:", process.env.CART_SERVICE_URL);
  console.log("=================================");
});
