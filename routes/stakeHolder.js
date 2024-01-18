const express = require("express");
const router = express.Router();
const {
  loginStakeholder,
  updateStakeholder,
} = require("../controllers/stakeholder");
const { getContractsByStakeHolder } = require("../controllers/contract");
const { protect, protectStackholder } = require("../middleware/auth");
const { logoutUser } = require("../controllers/users");
const {
  getAllStakeholders,
  getAllContractors,
} = require("../controllers/admin");

router.post("/login", loginStakeholder);
router.put("/profile", protect, protectStackholder, updateStakeholder);

router.route("/stakeholders").get(protect, getAllStakeholders);
router.route("/contractors").get(protect, getAllContractors);
router.get(
  "/:staholderId/contracts",
  protect,
  protectStackholder,
  getContractsByStakeHolder
);
// router.post("/logout", protect, protectStackholder, logoutUser);

module.exports = router;
