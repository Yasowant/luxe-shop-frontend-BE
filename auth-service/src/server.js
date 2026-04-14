require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.routes");

const app = express();

// 🔥 GLOBAL LOGGER (IMPORTANT FOR DEBUG)
app.use((req, res, next) => {
  console.log("🔥 AUTH SERVICE HIT:", req.method, req.url);
  next();
});

// Middleware
// ✅ CORS (IMPORTANT for Vercel frontend)
app.use(
  cors({
    origin: ["http://localhost:8080", "https://luxe-shop-frontend.vercel.app"],
    credentials: true,
  }),
);

app.use(express.json());

// DB
connectDB();

// Routes
// app.use("/api/auth", authRoutes);
app.use("/", authRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Auth Service Running 🚀");
});

// Server
app.listen(process.env.PORT || 4001, () => {
  console.log(`Auth running on ${process.env.PORT}`);
});
