const express = require("express");
const router = express.Router();
const {
  loginStackholder,
  updateStackholder,
} = require("../controllers/stackholder");
const { protectStackholder } = require("../middleware/auth");

router.post("/login", loginStackholder);
router.put("/profile", protectStackholder, updateStackholder);

module.exports = router;
