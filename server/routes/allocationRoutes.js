const express = require("express");
const router = express.Router();
const { runAllocation, resetAllocation } = require("../controllers/allocationController");
const { getMyAllocation } = require("../controllers/allocationController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

router.post(
  "/run",
  protect,
  authorizeRoles("admin"),
  runAllocation
);
router.post(
  "/reset",
  protect,
  authorizeRoles("admin"),
  resetAllocation
);
router.get(
  "/result",
  protect,
  authorizeRoles("student"),
  getMyAllocation
);
module.exports = router;