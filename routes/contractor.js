const express = require("express");
const router = express.Router();
const {
  loginContractor,
  updateContractorProfile,
} = require("../controllers/contractor");
const { getContractsByContractor } = require("../controllers/contract");
const { createNote, getNotesByContract } = require("../controllers/note");
const { protectContractor, protect } = require("../middleware/auth");
const { logoutUser } = require("../controllers/users");
const cors = require("cors");
const {
  getAllStakeholders,
  getAllContractors,
} = require("../controllers/admin");

router.post("/login", cors(), loginContractor);
router.put("/profile", protectContractor, protect, updateContractorProfile);
router.route("/contractors").get(protectContractor, getAllContractors);
router.route("/stakeholders").get(protectContractor, getAllStakeholders);
router.get(
  "/:contractorId/contracts",
  // protectContractor,
  protect,
  getContractsByContractor
);
router.post("/createnote", protect, createNote);
router.get("/note/:contractId", protect, getNotesByContract);
// router.post("/logout", protect, logoutUser);
module.exports = router;
