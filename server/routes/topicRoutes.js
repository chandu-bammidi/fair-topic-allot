const express = require("express");
const router = express.Router();

const {
  createTopic,
  getAllTopics,
  getMyTopics,
  updateTopic,
  deleteTopic,
} = require("../controllers/topicController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");


// =======================================
// Faculty creates topic
// POST /api/topics
// =======================================
router.post(
  "/",
  protect,
  authorizeRoles("faculty"),
  createTopic
);


// =======================================
// Faculty views only their topics
// GET /api/topics/my-topics
// =======================================
router.get(
  "/my-topics",
  protect,
  authorizeRoles("faculty"),
  getMyTopics
);


// =======================================
// All logged-in users view all topics
// GET /api/topics
// =======================================
router.get(
  "/",
  protect,
  getAllTopics
);

router.put(
  "/:id",
  protect,
  authorizeRoles("faculty"),
  updateTopic
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("faculty"),
  deleteTopic
);

module.exports = router;