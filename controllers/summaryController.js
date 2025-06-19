const Asset = require("../models/Asset");
const Purchase = require("../models/Purchase");
const Transfer = require("../models/Transfer");
const Assignment = require("../models/Assignment");
const Expenditure = require("../models/Expenditure");

const getSummary = async (req, res) => {
  try {
    let { base, type } = req.query;
    const user = req.user;

    // RBAC Enforcement
    let filteredBase;

    if (user.role === 'commander' || user.role === 'logistics') {
    
      if (base && base !== user.base) {
        return res.status(403).json({ message: 'Access denied to other bases' });
      }
      filteredBase = user.base;
    } else {
      // Admins can view any base
      filteredBase = base;
    }

    //Shared filter object for models with "base"
    const filter = {};
    if (filteredBase) filter.base = filteredBase;
    if (type) filter.type = type;

    // Aggregations
    const closing = await Asset.aggregate([
      { $match: filter },
      { $group: { _id: null, total: { $sum: "$quantity" } } }
    ]);

    const purchases = await Purchase.aggregate([
      { $match: filter },
      { $group: { _id: null, total: { $sum: "$quantity" } } }
    ]);

    const transfersIn = await Transfer.aggregate([
      {
        $match: {
          ...(filteredBase && { toBase: filteredBase }),
          ...(type && { type })
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$quantity" }
        }
      }
    ]);

    const transfersOut = await Transfer.aggregate([
      {
        $match: {
          ...(filteredBase && { fromBase: filteredBase }),
          ...(type && { type })
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$quantity" }
        }
      }
    ]);

    const assigned = await Assignment.aggregate([
      { $match: filter },
      { $group: { _id: null, total: { $sum: "$quantity" } } }
    ]);

    const expended = await Expenditure.aggregate([
      { $match: filter },
      { $group: { _id: null, total: { $sum: "$quantity" } } }
    ]);

    return res.status(200).json({
      base: filteredBase,
      type: type || 'all',
      openingBalance: 0,
      closingBalance: closing[0]?.total || 0,
      assigned: assigned[0]?.total || 0,
      expended: expended[0]?.total || 0,
      netMovement: {
        purchases: purchases[0]?.total || 0,
        transferIn: transfersIn[0]?.total || 0,
        transferOut: transfersOut[0]?.total || 0
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getSummary };
