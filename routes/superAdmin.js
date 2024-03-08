const express = require("express");
const router = express.Router();
const {
  createUser,
  loginSuperAdmin,
  updateSuperAdminProfile,
  registerSuperAdmin,
  getAllAdmins,
} = require("../controllers/superAdmin");
const { protect, protectSuperAdmin } = require("../middleware/auth");

router.route("/register").post(protect, registerSuperAdmin);
router.post("/login", loginSuperAdmin);
router.put("/profile", protect, protectSuperAdmin, updateSuperAdminProfile);
router.route("/createadmin").post(protect, createUser);
router.get("/admin", protectSuperAdmin, getAllAdmins);

module.exports = router;
