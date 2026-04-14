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
    origin: "*", // change in production
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

// ✅ REQUEST LOGGER
app.use((req, res, next) => {
  console.log(`🌐 Incoming Request → ${req.method} ${req.originalUrl}`);
  next();
});

// 🔥 AUTH SERVICE
app.use(
  "/api/auth",
  createProxyMiddleware({
    target: process.env.AUTH_SERVICE_URL,
    changeOrigin: true,

    pathRewrite: {
      "^/api/auth": "/api/auth", // ✅ PRESERVE PATH
    },

    onProxyReq: (proxyReq, req) => {
      console.log(
        `➡️ [AUTH] ${req.method} ${req.originalUrl} → ${process.env.AUTH_SERVICE_URL}`,
      );
    },

    onProxyRes: (proxyRes, req) => {
      console.log(`✅ [AUTH] ${proxyRes.statusCode} ← ${req.originalUrl}`);
    },

    onError: (err, req, res) => {
      console.error("❌ [AUTH ERROR]:", err.message);
      res.status(500).json({ error: "Auth service error" });
    },
  }),
);

// 📦 PRODUCT SERVICE
app.use(
  "/api/products",
  createProxyMiddleware({
    target: process.env.PRODUCT_SERVICE_URL,
    changeOrigin: true,

    pathRewrite: {
      "^/api/products": "/api/products",
    },

    onProxyReq: (proxyReq, req) => {
      console.log(`➡️ [PRODUCT] ${req.method} ${req.originalUrl}`);
    },

    onProxyRes: (proxyRes, req) => {
      console.log(`✅ [PRODUCT] ${proxyRes.statusCode}`);
    },
  }),
);

// 📑 ORDER SERVICE
app.use(
  "/api/orders",
  createProxyMiddleware({
    target: process.env.ORDER_SERVICE_URL,
    changeOrigin: true,

    pathRewrite: {
      "^/api/orders": "/api/orders",
    },

    onProxyReq: (proxyReq, req) => {
      console.log(`➡️ [ORDER] ${req.method} ${req.originalUrl}`);
    },

    onProxyRes: (proxyRes, req) => {
      console.log(`✅ [ORDER] ${proxyRes.statusCode}`);
    },
  }),
);

// 🛒 CART SERVICE
app.use(
  "/api/cart",
  createProxyMiddleware({
    target: process.env.CART_SERVICE_URL,
    changeOrigin: true,

    pathRewrite: {
      "^/api/cart": "/api/cart",
    },

    onProxyReq: (proxyReq, req) => {
      console.log(`➡️ [CART] ${req.method} ${req.originalUrl}`);
    },

    onProxyRes: (proxyRes, req) => {
      console.log(`✅ [CART] ${proxyRes.statusCode}`);
    },
  }),
);

// ✅ HEALTH CHECK
app.get("/", (req, res) => {
  res.json({
    message: "🚀 API Gateway Running",
    services: {
      auth: process.env.AUTH_SERVICE_URL,
      product: process.env.PRODUCT_SERVICE_URL,
      order: process.env.ORDER_SERVICE_URL,
      cart: process.env.CART_SERVICE_URL,
    },
  });
});

// ✅ START SERVER
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
