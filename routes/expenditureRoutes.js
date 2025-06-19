const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/rbacMiddleware");
const { expend,getExpenditures} = require("../controllers/expenditureController");

router.post("/expend", protect, allowRoles("admin", "commander"), expend);
router.get("/getExpenditures", protect, allowRoles("admin", "commander"), getExpenditures);

module.exports = router;
