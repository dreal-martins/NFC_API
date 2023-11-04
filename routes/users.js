const express = require("express");
const router = express.Router();
const {
  authUser,
  logoutUser,
  getUserProfiles,
  getUserById,
  updateUserProfile,
} = require("../controllers/users");
const { protect } = require("../middleware/auth");

router.post("/login", authUser);
router.post("/logout", logoutUser);
router
  .route("/profiles")
  .put(protect, updateUserProfile)
  .get(protect, getUserProfiles);
router.route("/profile/:userId").get(protect, getUserById);

module.exports = router;
