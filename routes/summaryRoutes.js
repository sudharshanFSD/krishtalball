const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/rbacMiddleware");

const { getSummary } = require("../controllers/summaryController");

router.get("/summary", protect, allowRoles("admin", "commander"), getSummary);

module.exports = router;
