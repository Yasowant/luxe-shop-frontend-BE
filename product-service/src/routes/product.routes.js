const router = require("express").Router();

const { protect, authorize } = require("../../../common");
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  reduceStock,
  restoreStock,
} = require("../controllers/product.controller");

// const { protect, authorize } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

// ✅ ADMIN ONLY
router.post(
  "/",
  protect,
  authorize("admin"),
  upload.array("images"),
  createProduct,
);

// 🔥 FIX: PUT THIS FIRST
router.put("/reduce-stock", protect, authorize("admin"), reduceStock);
router.put("/restore-stock", protect, authorize("admin"), restoreStock);

// OTHER ROUTES
router.put("/:id", protect, authorize("admin"), updateProduct);
router.delete("/:id", protect, authorize("admin"), deleteProduct);

// PUBLIC
router.get("/", getProducts);
router.get("/:id", getProductById);

module.exports = router;
