const mongoose = require("mongoose");

const systemConfigSchema = new mongoose.Schema({
  preferenceDeadline: {
    type: Date,
    default: null,
  },
  allocationDone: {
    type: Boolean,
    default: false,
  },
});

module.exports =
  mongoose.models.SystemConfig ||
  mongoose.model("SystemConfig", systemConfigSchema);