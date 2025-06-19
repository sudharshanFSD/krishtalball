const Asset = require("../models/Asset");
const Purchase = require("../models/Purchase");

const purchaseController = async (req, res) => {
  try {
    const user = req.user;

    let { name, type, quantity, base } = req.body;
     console.log("Logged in user role:", req.user.role);

    // Logistics not allowed
    if (user.role === "logistics") {
      return res.status(403).json({ message: "Logistics officers are not allowed to purchase assets." });
    }

    // Force base for commanders
    if (user.role === "commander") {
      base = user.base;
    }

    // Field Validation
    if (!name || !type || !quantity || !base) {
      return res.status(400).json({ message: "All fields are required." });
    }

    quantity = Number(quantity);

    let asset = await Asset.findOne({ name, base });

    if (asset) {
      asset.quantity += quantity;
      await asset.save();
    } else {
      asset = await Asset.create({ name, type, quantity, base });
    }

    await Purchase.create({
      name,
      type,
      quantity,
      base,
      purchasedBy: user._id,
    });

    res.status(200).json({ message: "Asset purchased successfully", asset });
  } catch (err) {
    console.error("Purchase Error:", err);
    res.status(500).json({ message: "Error purchasing asset", error: err.message });
  }
};


const getAllPurchases = async (req, res) => {
  try {
    const { type, startDate, endDate } = req.query;
    const query = {};

    //  Filter by asset type
    if (type) query.type = type;

    //  Filter by date range
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    //  RBAC: Commander only sees purchases from their base
    if (req.user.role === "commander") {
      query.base = req.user.base;
    }

    // Admin and Logistics see all bases
    const purchases = await Purchase.find(query).sort({ createdAt: -1 });

    res.status(200).json(purchases);
  } catch (err) {
    console.error("Error fetching purchases:", err);
    res.status(500).json({ message: "Error fetching purchases" });
  }
};

module.exports = {
  purchaseController,
  getAllPurchases,
};
