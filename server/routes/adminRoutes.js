const express = require("express");
const router = express.Router();
const { getConfig } = require("../controllers/adminController");


const {
  getAllStudents,
  getAllPreferences,
  setDeadline,
} = require("../controllers/adminController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// All routes admin-only
router.use(protect, authorizeRoles("admin"));

router.get("/students", getAllStudents);
router.get("/preferences", getAllPreferences);
router.post("/deadline", setDeadline);
router.get("/config", getConfig);

module.exports = router;