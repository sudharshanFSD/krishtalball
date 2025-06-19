const Asset = require("../models/Asset");
const Expenditure = require("../models/Expenditure");

const expend = async (req, res) => {
  try {
    if (!['admin', 'commander'].includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: You are not allowed to expend assets" });
    }

    const { name, type, quantity, base } = req.body;

    // Commander can only expend from their base
    if (req.user.role === 'commander' && base !== req.user.base) {
      return res.status(403).json({ message: "Commanders can expend only from their base" });
    }

    

    const asset = await Asset.findOne({ name, type, base });
  

    if (!asset || asset.quantity < quantity) {
      console.log(" Insufficient Quantity | Available:", asset?.quantity, "| Requested:", quantity);
      return res.status(400).json({ message: "Insufficient quantity to expend" });
    }

    asset.quantity -= quantity;
    await asset.save();

    const expenditure = await Expenditure.create({
      assetName: name,
      type,
      quantity,
      base,
      expendedBy: req.user._id,
    });

    res.status(201).json({ message: "Asset expended", expenditure });
  } catch (err) {
    console.error("Expenditure Error:", err);
    res.status(500).json({ message: "Expenditure failed", error: err.message });
  }
};


const getExpenditures = async (req, res) => {
  try {
    const user = req.user;
    const { type, startDate, endDate } = req.query;

    const query = {};

    // Commander should only see their own base
    if (user.role === 'commander') {
      query.base = user.base;
    }

    if (type) query.type = type;
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const expenditures = await Expenditure.find(query)
      .populate("expendedBy", "name email") //  populate user info
      .sort({ createdAt: -1 });

    res.status(200).json(expenditures);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch expenditures", error: err.message });
  }
};


module.exports = { expend, getExpenditures };
