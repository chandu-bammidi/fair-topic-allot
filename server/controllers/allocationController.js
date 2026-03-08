const User = require("../models/User");
const Topic = require("../models/Topic");
const Preference = require("../models/Preference");
const SystemConfig = require("../models/SystemConfig");

// =======================================
// @desc    Run Stable Matching Allocation
// @route   POST /api/allocation/run
// @access  Admin only
// =======================================
exports.runAllocation = async (req, res) => {
    try {
        // 🔒 Allocation Lock Check
    let config = await SystemConfig.findOne();

    if (!config) {
    config = await SystemConfig.create({});
    }

    if (config.allocationStatus === "COMPLETED") {
    return res.status(400).json({
        success: false,
        message: "Allocation already completed. Reset required before re-running.",
    });
    }

    // Mark as running
    config.allocationStatus = "RUNNING";
    await config.save();
    // 1️⃣ Get students with preferences
    const preferences = await Preference.find()
      .populate("student")
      .lean();

    const topics = await Topic.find().lean();

    // Map topics by id
    const topicMap = {};
    topics.forEach(topic => {
      topicMap[topic._id] = {
        ...topic,
        assigned: []
      };
    });

    // Free students queue
    const freeStudents = preferences.map(p => ({
      studentId: p.student._id.toString(),
      cgpa: p.student.cgpa,
      preferenceList: p.preferences.map(id => id.toString()),
      currentIndex: 0
    }));

    // Main loop
    while (freeStudents.length > 0) {
      const student = freeStudents.shift();

      if (student.currentIndex >= student.preferenceList.length) {
        continue; // no more preferences
      }

      const topicId = student.preferenceList[student.currentIndex];
      const topic = topicMap[topicId];

      if (!topic) {
        student.currentIndex++;
        freeStudents.push(student);
        continue;
      }

      topic.assigned.push(student);

      // Sort by CGPA descending
      topic.assigned.sort((a, b) => b.cgpa - a.cgpa);

      if (topic.assigned.length > topic.maxStudents) {
        const rejected = topic.assigned.pop();
        rejected.currentIndex++;
        freeStudents.push(rejected);
      }
    }

    // 2️⃣ Clear previous assignments
    await User.updateMany({}, { assignedTopic: null });
    await Topic.updateMany({}, { assignedStudents: [] });

    // 3️⃣ Save results
    for (let topicId in topicMap) {
      const topic = topicMap[topicId];

      const studentIds = topic.assigned.map(s => s.studentId);

      await Topic.findByIdAndUpdate(topicId, {
        assignedStudents: studentIds
      });

      await User.updateMany(
        { _id: { $in: studentIds } },
        { assignedTopic: topicId }
      );
    }
 // Mark allocation as completed
    config.allocationStatus = "COMPLETED";
    config.lastRunAt = new Date();
    await config.save();
    res.json({
      success: true,
      message: "Allocation completed successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
exports.resetAllocation = async (req, res) => {
  try {

    await User.updateMany({}, { assignedTopic: null });
    await Topic.updateMany({}, { assignedStudents: [] });

    const config = await SystemConfig.findOne();

    if (config) {
      config.allocationStatus = "NOT_STARTED";
      config.lastRunAt = null;
      await config.save();
    }

    res.json({
      success: true,
      message: "Allocation reset successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
exports.getMyAllocation = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("assignedTopic", "title description domain");

    if (!user.assignedTopic) {
      return res.status(404).json({
        success: false,
        message: "No allocation found yet."
      });
    }

    res.json({
      success: true,
      data: user.assignedTopic
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};