const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/rbacMiddleware");

const { purchaseController,getAllPurchases } = require("../controllers/purchaseController");


router.post("/purchase", protect, allowRoles("admin", "commander"), (req, res, next) => {
  purchaseController(req, res, next);
});

router.get("/purchase", protect, allowRoles("admin", "commander", "logistics"), (req, res, next) => {
  getAllPurchases(req, res, next);
});


module.exports = router;
