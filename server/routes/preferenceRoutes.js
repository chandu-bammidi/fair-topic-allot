const express = require("express");
const router = express.Router();

const {
  submitPreferences,
  getMyPreference
} = require("../controllers/preferenceController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const { getAllPreferences } = require("../controllers/preferenceController");

router.post(
  "/",
  protect,
  authorizeRoles("student"),
  submitPreferences
);

router.get(
  "/",
  protect,
  authorizeRoles("admin"),
  getAllPreferences
);

router.get(
  "/me",
  protect,
  authorizeRoles("student"),
  getMyPreference
);

module.exports = router;
