// require("dotenv").config();

// const express = require("express");
// const cors = require("cors");
// const { createProxyMiddleware } = require("http-proxy-middleware");

// const app = express();

// app.use(
//   cors({
//     origin: "http://localhost:8080",
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true,
//   }),
// );

// app.use((req, res, next) => {
//   console.log("🌐 Gateway:", req.method, req.url);
//   next();
// });

// // ✅ AUTH SERVICE (FIXED WITH ENV)
// app.use(
//   "/api/auth",
//   createProxyMiddleware({
//     target: `${process.env.AUTH_SERVICE_URL}/api/auth`,
//     changeOrigin: true,
//   }),
// );

// // ✅ PRODUCT SERVICE (FIXED WITH ENV)
// app.use(
//   "/api/products",
//   createProxyMiddleware({
//     target: `${process.env.PRODUCT_SERVICE_URL}/api/products`,
//     changeOrigin: true,
//   }),
// );

// app.use(
//   "/api/orders",
//   createProxyMiddleware({
//     target: `${process.env.ORDER_SERVICE_URL}/api/orders`,
//     changeOrigin: true,
//   }),
// );

// app.use(
//   "/api/cart",
//   createProxyMiddleware({
//     target: `${process.env.CART_SERVICE_URL}/api/cart`,
//     changeOrigin: true,
//   }),
// );

// app.listen(process.env.PORT || 4000, () => {
//   console.log(`🚀 Gateway running on ${process.env.PORT}`);
// });
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

// ✅ CORS
app.use(
  cors({
    origin: "*", // allow all for testing (change later)
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

// ✅ Request Logger
app.use((req, res, next) => {
  console.log(`🌐 Incoming Request → ${req.method} ${req.originalUrl}`);
  next();
});

// 🔥 COMMON DEBUG HANDLER
const proxyOptions = (targetName, targetUrl) => ({
  target: targetUrl, // ✅ ONLY BASE URL
  changeOrigin: true,

  onProxyReq: (proxyReq, req, res) => {
    console.log(
      `➡️ [${targetName}] Forwarding → ${req.method} ${targetUrl}${req.originalUrl}`,
    );
  },

  onProxyRes: (proxyRes, req, res) => {
    console.log(
      `✅ [${targetName}] Response → ${proxyRes.statusCode} ${req.originalUrl}`,
    );
  },

  onError: (err, req, res) => {
    console.error(`❌ [${targetName}] Error →`, err.message);
    res.status(500).json({
      message: `${targetName} service error`,
      error: err.message,
    });
  },
});

// ✅ AUTH SERVICE
app.use(
  "/api/auth",
  createProxyMiddleware(proxyOptions("AUTH", process.env.AUTH_SERVICE_URL)),
);

// ✅ PRODUCT SERVICE
app.use(
  "/api/products",
  createProxyMiddleware(
    proxyOptions("PRODUCT", process.env.PRODUCT_SERVICE_URL),
  ),
);

// ✅ ORDER SERVICE
app.use(
  "/api/orders",
  createProxyMiddleware(proxyOptions("ORDER", process.env.ORDER_SERVICE_URL)),
);

// ✅ CART SERVICE
app.use(
  "/api/cart",
  createProxyMiddleware(proxyOptions("CART", process.env.CART_SERVICE_URL)),
);

// ✅ HEALTH CHECK
app.get("/", (req, res) => {
  res.json({
    status: "API Gateway running 🚀",
    services: ["auth", "products", "orders", "cart"],
  });
});

// ✅ START SERVER
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Gateway running on port ${PORT}`);
});
