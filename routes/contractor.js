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
router.put("/profile", protectContractor, protect, updateContractorProfile);
router.get(
  "/:contractorId/contracts",
  protectContractor,
  protect,
  getContractsByContractor
);
router.post("/createnote", protectContractor, protect, createNote);
router.get("/note/:contractId", protectContractor, protect, getNotesByContract);
module.exports = router;
