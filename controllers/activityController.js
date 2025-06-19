
const Purchase = require("../models/Purchase");
const Transfer = require("../models/Transfer");
const Assignment = require("../models/Assignment");
const Expenditure = require("../models/Expenditure");

const getRecentActivity = async (req, res) => {
  try {
    const [recentPurchases, recentTransfers, recentAssignments, recentExpenditures] = await Promise.all([
      Purchase.find().sort({ createdAt: -1 }).limit(5),
      Transfer.find().sort({ createdAt: -1 }).limit(5),
      Assignment.find().sort({ createdAt: -1 }).limit(5),
      Expenditure.find().sort({ createdAt: -1 }).limit(5),
    ]);

    res.status(200).json({
      purchases: recentPurchases,
      transfers: recentTransfers,
      assignments: recentAssignments,
      expenditures: recentExpenditures,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch recent activity", error: err.message });
  }
};

module.exports = { getRecentActivity };
