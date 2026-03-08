const User = require("../models/User");
const Topic = require("../models/Topic");
const Preference = require("../models/Preference");
const SystemConfig = require("../models/SystemConfig");

// ================================
// Get All Students
// ================================
exports.getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" })
      .select("-password");

    res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================================
// Get All Preferences
// ================================
exports.getAllPreferences = async (req, res) => {
  try {
    const preferences = await Preference.find()
      .populate("student", "name email")
      .populate("preferences", "title domain");

    res.status(200).json({
      success: true,
      count: preferences.length,
      data: preferences,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================================
// Set Preference Deadline
// ================================
exports.setDeadline = async (req, res) => {
  try {
    const { preferenceDeadline } = req.body;

    let config = await SystemConfig.findOne();

    if (!config) {
      config = await SystemConfig.create({ preferenceDeadline });
    } else {
      config.preferenceDeadline = preferenceDeadline;
      await config.save();
    }

    res.status(200).json({
      success: true,
      message: "Deadline updated",
      data: config,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ================================
// Get System Config
// ================================
exports.getConfig = async (req, res) => {
  try {
    const config = await SystemConfig.findOne();

    res.status(200).json({
      success: true,
      data: config,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};