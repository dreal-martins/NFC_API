const express = require("express");
const router = express.Router();
const {
  createContractor,
  getContractors,
  createContract,
  getAllContracts,
  getContractorById,
} = require("../controllers/admin");
const { registerUser } = require("../controllers/users");
const { protect, isAdmin } = require("../middleware/auth");

router.route("/register").post(protect, isAdmin, registerUser);
router.route("/createcontractor").post(protect, isAdmin, createContractor);
router.route("/contractors").get(protect, isAdmin, getContractors);
router.route("/createcontract").post(protect, isAdmin, createContract);
router.route("/contracts").get(protect, isAdmin, getAllContracts);
router
  .route("/contractor/:contractorId")
  .get(protect, isAdmin, getContractorById);
module.exports = router;
