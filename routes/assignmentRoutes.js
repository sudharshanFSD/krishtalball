
const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/rbacMiddleware");

const { assignAsset ,getAssignments} = require("../controllers/assignmentController");

router.post("/assign", protect, allowRoles("admin", "commander"), assignAsset);

router.get("/assign", protect, allowRoles("admin", "commander","logistics"), getAssignments);

module.exports = router;
