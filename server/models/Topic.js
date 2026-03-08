const mongoose = require("mongoose");

const topicSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Topic title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Topic description is required"],
    },
    domain: {
      type: String,
      required: [true, "Domain is required"],
    },
    maxStudents: {
      type: Number,
      required: true,
      min: 1,
    },
    assignedStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Topic", topicSchema);
