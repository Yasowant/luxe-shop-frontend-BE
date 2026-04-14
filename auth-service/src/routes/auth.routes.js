const router = require("express").Router();
const {
  register,
  login,
  refresh,
  logout,
  getProfile,
  updateProfile,
  updateUserRole,
  getAllUsers,
  deleteUser,
} = require("../controllers/auth.controller");
const { protect, authorize } = require("../middleware/auth.middleware");

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", protect, logout);
router.get("/me", protect, getProfile);
router.put("/update", protect, updateProfile);

router.get("/users", protect, authorize("admin"), getAllUsers);
router.delete("/user/:id", protect, authorize("admin"), deleteUser);
router.put("/user-role/:id", protect, authorize("admin"), updateUserRole);

module.exports = router;
