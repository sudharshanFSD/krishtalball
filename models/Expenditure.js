const mongoose = require("mongoose");

const expenditureSchema = new mongoose.Schema({
  assetName: { type: String, required: true },
  type: { type: String, required: true },
  quantity: { type: Number, required: true },
  base: { type: String, required: true },
  expendedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

module.exports = mongoose.model("Expenditure", expenditureSchema);
