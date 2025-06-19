const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/rbacMiddleware");
const { transferAsset,getTransfers } = require("../controllers/transferController");

router.post("/transfer", protect, allowRoles("admin","commander"), transferAsset);

router.get("/transfer", protect, allowRoles("admin", "logistics","commander"), getTransfers);

module.exports = router;
