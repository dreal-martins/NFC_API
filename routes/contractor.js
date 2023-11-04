const express = require("express");
const router = express.Router();
const {
  loginContractor,
  updateContractorProfile,
} = require("../controllers/contractor");
const { getContractsByContractor } = require("../controllers/contract");
const { createNote, getNotesByContract } = require("../controllers/note");
const { protectContractor, protect } = require("../middleware/auth");

router.post("/login", loginContractor);
router.put("/profile", protectContractor, updateContractorProfile);
router
  .route("/:contractorId/contracts")
  .get(protect, protectContractor, getContractsByContractor);
router.post("/createnote", protectContractor, createNote);
router.get("/note/:contractId", protectContractor, getNotesByContract);
module.exports = router;
