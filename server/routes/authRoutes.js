const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
} = require("../controllers/authController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const { getAllUsers } = require("../controllers/authController");

// ==============================
// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
// ==============================
router.post("/register", registerUser);

// ==============================
// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
// ==============================
router.post("/login", loginUser);

router.get(
  "/users",
  protect,
  authorizeRoles("admin"),
  getAllUsers
);

module.exports = router;
