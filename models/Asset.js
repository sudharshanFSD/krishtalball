const mongoose = require("mongoose");

const assetSchema = new mongoose.Schema({
  type: { type: String, required: true },
  name: { type: String, required: true }, 
  quantity: { type: Number, default: 0 },
  base: { type: String, required: true }, 
}, { timestamps: true });

module.exports = mongoose.model("Asset", assetSchema);
