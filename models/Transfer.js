const mongoose = require("mongoose");

const transferSchema = new mongoose.Schema({
  assetName: { type: String, required: true },
  type: { type: String, required: true },
  quantity: { type: Number, required: true },
  fromBase: { type: String, required: true },
  toBase: { type: String, required: true },
  transferredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

module.exports = mongoose.model("Transfer", transferSchema);
