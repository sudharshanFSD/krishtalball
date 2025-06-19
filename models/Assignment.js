const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
  assetName: { type: String, required: true },
  assetType: { type: String, required: true },
  quantity: { type: Number, required: true },
  base: { type: String, required: true },
  assignedTo: { type: String, required: true },
  assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  date: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model("Assignment", assignmentSchema);
