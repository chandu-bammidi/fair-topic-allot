const mongoose = require("mongoose");

const preferenceSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    preferences: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Topic",
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.Preference ||
  mongoose.model("Preference", preferenceSchema);