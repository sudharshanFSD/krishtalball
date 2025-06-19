const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/rbacMiddleware");
const { getAvailableFilters } = require("../controllers/assetController");
const { purchaseController } = require("../controllers/purchaseController");


router.post("/purchase", protect, allowRoles("admin", "commander"), purchaseController);

router.get("/filters", getAvailableFilters);


module.exports = router;
