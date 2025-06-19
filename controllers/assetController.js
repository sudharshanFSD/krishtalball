const Asset = require("../models/Asset");
const Purchase = require("../models/Purchase");
const User = require('../models/User');

const getAssets = async (req, res) => {
  try {
    const { base, type } = req.query;
    const query = {};

    if (base) query.base = base;
    if (type) query.type = type;

    const assets = await Asset.find(query);
    res.status(200).json(assets);
  } catch (err) {
    res.status(500).json({ message: "Failed to get assets", error: err.message });
  }
};

const getAssetById = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);
    if (!asset) return res.status(404).json({ message: "Asset not found" });

    res.status(200).json(asset);
  } catch (err) {
    res.status(500).json({ message: "Error fetching asset", error: err.message });
  }
};


const getAvailableFilters = async (req, res) => {
  try {
    const bases = await User.distinct("base");
    const types = await Asset.distinct("type"); 

    res.status(200).json({ bases, types });
  } catch (err) {
    console.error("Error fetching filters:", err);
    res.status(500).json({ message: "Failed to fetch filters" });
  }
};

module.exports = {
  getAssets,
  getAssetById,
  getAvailableFilters,
};
