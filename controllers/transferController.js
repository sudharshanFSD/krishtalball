const Asset = require("../models/Asset");
const Transfer = require("../models/Transfer");

const transferAsset = async (req, res) => {
  try {
    const { name, type, fromBase, toBase } = req.body;
    const quantity = Number(req.body.quantity);

    if (!quantity || isNaN(quantity)) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    if (fromBase === toBase) {
      return res.status(400).json({ message: "Source and destination cannot be the same" });
    }

    const fromAsset = await Asset.findOne({ name, base: fromBase, type });
    if (!fromAsset) {
      return res.status(400).json({ message: "Asset not found in source base" });
    }

    if (fromAsset.quantity < quantity) {
      return res.status(400).json({
        message: `Insufficient quantity. Available: ${fromAsset.quantity}, Requested: ${quantity}`
      });
    }

    fromAsset.quantity -= quantity;
    await fromAsset.save();

    let toAsset = await Asset.findOne({ name, base: toBase, type });
    if (toAsset) {
      toAsset.quantity += quantity;
      await toAsset.save();
    } else {
      toAsset = await Asset.create({ name, type, quantity, base: toBase });
    }

    const transfer = await Transfer.create({
      assetName: name,
      type,
      quantity,
      fromBase,
      toBase,
      transferredBy: req.user._id,
    });

    res.status(201).json({ message: "Asset transferred successfully", transfer });

  } catch (err) {
    console.error("Transfer Error :", err);
    res.status(500).json({ message: "Transfer failed", error: err.message });
  }
};

const getTransfers = async (req, res) => {
  try {
    const { type, startDate, endDate } = req.query;
    const user = req.user;

    const filter = {};

    if (type) {
      filter.type = type;
    }

    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    if (user.role === "commander") {
      // Commander sees only transfers involving their base
      filter.$or = [
        { fromBase: user.base },
        { toBase: user.base }
      ];
    }

    const transfers = await Transfer.find(filter)
      .populate("transferredBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(transfers);

  } catch (err) {
    res.status(500).json({ message: "Failed to fetch transfers", error: err.message });
  }
};

module.exports = { transferAsset,getTransfers };
