const express = require("express");
const router = express.Router();
const {
  createContractor,
  getAllContractors,
  getAllStakeholders,
  createContract,
  getAllContracts,
  getContractorById,
  createStakeHolder,
  getStakeholderById,
} = require("../controllers/admin");
const {
  registerUser,
  authUser,
  updateUserProfile,
  getUserProfiles,
  getUserById,
  logoutUser,
} = require("../controllers/users");
const { protect, isAdmin } = require("../middleware/auth");

router.route("/register").post(registerUser);
router.post("/login", authUser);
router
  .route("/profiles")
  .put(protect, isAdmin, updateUserProfile)
  .get(protect, isAdmin, getUserProfiles);
router.route("/profile/:userId").get(getUserById);
router.route("/createcontractor").post(protect, isAdmin, createContractor);
router.route("/contractors").get(protect, isAdmin, getAllContractors);
router.route("/stakeholders").get(protect, isAdmin, getAllStakeholders);
router.route("/createcontract").post(protect, isAdmin, createContract);
router.route("/contracts").get(protect, isAdmin, getAllContracts);
router.route("/createstakeholder").post(protect, isAdmin, createStakeHolder);
router
  .route("/contractor/:contractorId")
  .get(protect, isAdmin, getContractorById);
router
  .route("/stakeholder/:stakeholderId")
  .get(protect, isAdmin, getStakeholderById);
router.post("/logout", logoutUser);
module.exports = router;
