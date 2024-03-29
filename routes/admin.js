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
  deleteContract,
  getAllUsers,
} = require("../controllers/admin");
const cors = require("cors");
const {
  registerUser,
  authUser,
  updateUserProfile,
  getUserProfiles,
  getUserById,
  logoutUser,
} = require("../controllers/users");
const {
  getContractsByAdmin,
  changeContractStatus,
} = require("../controllers/contract");
const { approveNote } = require("../controllers/note");
const { protect, isAdmin } = require("../middleware/auth");

// router.route("/register").post(registerUser);
router.post("/login", cors(), authUser);
router.route("/profiles").get(protect, isAdmin, getUserProfiles);
router.route("/profile").put(protect, isAdmin, updateUserProfile);
router.route("/profile/:userId").get(getUserById);
router.route("/createcontractor").post(protect, isAdmin, createContractor);
router.route("/contractors").get(protect, getAllContractors);
router.route("/stakeholders").get(protect, getAllStakeholders);
router.route("/createcontract").post(protect, isAdmin, createContract);
router.route("/:adminId/contracts").get(protect, getAllContracts);
router.route("/createstakeholder").post(protect, isAdmin, createStakeHolder);
router.route("/contractor/:contractorId").get(protect, getContractorById);
router
  .route("/:contractId/updatestatus")
  .put(protect, isAdmin, changeContractStatus);
router
  .route("/stakeholder/:stakeholderId")
  .get(protect, isAdmin, getStakeholderById);
// router.route("/:adminId/contracts").get(protect, isAdmin, getContractsByAdmin);
router.put("/note/approve/:noteId", protect, isAdmin, approveNote);
router.delete("/contract/:contractId", protect, isAdmin, deleteContract);
router.get("/users", protect, isAdmin, getAllUsers);
// router.post("/logout", protect, isAdmin, logoutUser);

module.exports = router;
