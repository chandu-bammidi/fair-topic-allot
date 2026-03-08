const Topic = require("../models/Topic");


// =======================================
// @desc    Create new topic
// @route   POST /api/topics
// @access  Faculty only
// =======================================
exports.createTopic = async (req, res) => {
  try {
    const { title, description, domain, maxStudents } = req.body;

    const topic = await Topic.create({
      title,
      description,
      domain,
      maxStudents,
      createdBy: req.user._id, // faculty ID
    });

    res.status(201).json({
      success: true,
      message: "Topic created successfully",
      data: topic,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// =======================================
// @desc    Get ALL topics
// @route   GET /api/topics
// @access  Logged-in users
// =======================================
exports.getAllTopics = async (req, res) => {
  try {
    const topics = await Topic.find()
      .populate("createdBy", "name email role")
      .populate("assignedStudents", "name email");

    res.status(200).json({
      success: true,
      count: topics.length,
      data: topics,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// // =======================================
// @desc    Update topic
// @route   PUT /api/topics/:id
// @access  Faculty only (own topic)
// =======================================
exports.updateTopic = async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id);

    if (!topic) {
      return res.status(404).json({ success: false, message: "Topic not found" });
    }

    // Check ownership
    if (topic.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    // 🔒 Prevent editing if students assigned
    if (topic.assignedStudents.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot edit topic after students are assigned",
      });
    }

    const updatedTopic = await Topic.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: updatedTopic,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================================
// @desc    Delete topic
// @route   DELETE /api/topics/:id
// @access  Faculty only (own topic)
// =======================================
exports.deleteTopic = async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id);

    if (!topic) {
      return res.status(404).json({ success: false, message: "Topic not found" });
    }

    // Check ownership
    if (topic.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    // 🔒 Prevent deletion if students assigned
    if (topic.assignedStudents.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete topic after students are assigned",
      });
    }

    await topic.deleteOne();

    res.status(200).json({
      success: true,
      message: "Topic deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================================
// @desc    Get topics created by logged-in faculty
// @route   GET /api/topics/my-topics
// @access  Faculty only
// =======================================
exports.getMyTopics = async (req, res) => {
  try {
    const topics = await Topic.find({
      createdBy: req.user._id,
    })
      .populate("assignedStudents", "name email");

    res.status(200).json({
      success: true,
      count: topics.length,
      data: topics,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};