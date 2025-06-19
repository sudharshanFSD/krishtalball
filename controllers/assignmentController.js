// controllers/assignmentController.js
const Asset = require("../models/Asset");
const Assignment = require("../models/Assignment");

const assignAsset = async (req, res) => {
  try {
    if (!['admin', 'commander'].includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: You are not allowed to assign assets" });
    }

    const { name, type, quantity, base, assignedTo } = req.body;

    if (req.user.role === 'commander' && base !== req.user.base) {
      return res.status(403).json({ message: "Commanders can assign only for their own base" });
    }

    const asset = await Asset.findOne({ name, type, base });

    if (!asset || asset.quantity < quantity) {
      console.log("Insufficient Quantity | Available:", asset?.quantity, "| Requested:", quantity);
      return res.status(400).json({ message: "Insufficient quantity in base" });
    }

    asset.quantity -= quantity;
    await asset.save();

    const assignment = await Assignment.create({
      assetName: name,
      assetType: type,
      quantity,
      base,
      assignedTo,
      assignedBy: req.user._id,
    });

    res.status(201).json({ message: "Asset assigned", assignment });
  } catch (err) {
    console.error("Assignment Error:", err);
    res.status(500).json({ message: "Assignment failed", error: err.message });
  }
};


const getAssignments = async (req, res) => {
  try {
    const user = req.user;
    const { type, startDate, endDate } = req.query;

    const query = {};

    if (user.role === 'commander' || user.role === 'logistics') {
      query.base = user.base;
    }

    if (type) query.assetType = type;
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const assignments = await Assignment.find(query).sort({ createdAt: -1 });
    res.status(200).json(assignments);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch assignments", error: err.message });
  }
};

module.exports = { assignAsset,getAssignments };
