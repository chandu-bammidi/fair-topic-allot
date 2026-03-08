const Topic = require("../models/Topic");
const Preference = require("../models/preference");

exports.submitPreferences = async (req, res) => {
  try {
    const { preferences } = req.body;

    // Check existing
    let existing = await Preference.findOne({
      student: req.user._id,
    });

    if (existing) {
      // UPDATE instead of reject
      existing.preferences = preferences;
      await existing.save();

      return res.status(200).json({
        success: true,
        message: "Preferences updated successfully",
        data: existing,
      });
    }

    // CREATE if not exists
    const preference = await Preference.create({
      student: req.user._id,
      preferences,
    });

    res.status(201).json({
      success: true,
      message: "Preferences submitted successfully",
      data: preference,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// =======================================
// @desc    Get all preferences
// @route   GET /api/preferences
// @access  Admin only
// =======================================
exports.getAllPreferences = async (req, res) => {
  try {
    const preferences = await Preference.find()
      .populate("student", "name email cgpa")
      .populate("preferences", "title");
    
    res.json({
      success: true,
      count: preferences.length,
      data: preferences
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


exports.getMyPreference = async (req, res) => {
  try {
      const preference = await Preference.findOne({
        student: req.user._id,
      }).populate("preferences", "title domain");


    res.status(200).json({
      success: true,
      data: preference,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};