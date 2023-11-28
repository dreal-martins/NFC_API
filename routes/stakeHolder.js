const express = require("express");
const router = express.Router();
const {
  loginStakeholder,
  updateStakeholder,
} = require("../controllers/stakeholder");
const { getContractsByStakeHolder } = require("../controllers/contract");
const { protect, protectStackholder } = require("../middleware/auth");

router.post("/login", protect, protectStackholder, loginStakeholder);
router.put("/profile", protect, protectStackholder, updateStakeholder);
router.get(
  "/:staholderId/contracts",
  protect,
  protectStackholder,
  getContractsByStakeHolder
);

module.exports = router;
