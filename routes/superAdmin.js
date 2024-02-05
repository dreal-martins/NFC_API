const express = require("express");
const router = express.Router();
const {
  createUser,
  loginSuperAdmin,
  updateSuperAdminProfile,
  registerSuperAdmin,
} = require("../controllers/superAdmin");
const { protect, protectSuperAdmin } = require("../middleware/auth");

router.route("/register").post(protect, registerSuperAdmin);
router.post("/login", loginSuperAdmin);
router.put("/profile", protect, protectSuperAdmin, updateSuperAdminProfile);
router.route("/createadmin").post(protect, createUser);

module.exports = router;
