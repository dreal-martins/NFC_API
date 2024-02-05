const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const SuperAdmin = require("../models/SuperAdmin");
const generateRandomPassword = require("../utils/generatePassword");
const sendLoginDetails = require("../utils/sendLoginDetails");
const { generateSuperAdminToken } = require("../utils/generateToken");

// @desc Create Contractor
// route POST /superadmin/createuser
// @access Private
const createUser = asyncHandler(async (req, res) => {
  try {
    const { name, email, phoneNumber, role } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ success: false, err: "Admin already exists" });
    }

    const randomPassword = generateRandomPassword(10);
    const loginDetails = {
      email: email,
      password: randomPassword,
    };

    const emailSent = await sendLoginDetails(email, loginDetails);

    if (emailSent) {
      try {
        const user = await User.create({
          name,
          email,
          phoneNumber,
          role,
          password: randomPassword,
        });

        const { password, ...userWithoutPassword } = user._doc;
        return res
          .status(201)
          .json({
            success: true,
            msg: "admin created sucessfully",
            data: userWithoutPassword,
          });
      } catch (dbError) {
        return res
          .status(500)
          .json({ success: false, err: "Error creating user account" });
      }
    } else {
      return res
        .status(500)
        .json({ success: false, err: "Error sending login details email" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, err: "Internal Server Error" });
  }
});

const loginSuperAdmin = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    const superAdmin = await SuperAdmin.findOne({ email });

    if (superAdmin && (await superAdmin.matchPassword(password))) {
      const token = generateSuperAdminToken(superAdmin);

      res.setHeader("Authorization", `Bearer ${token}`);

      const data = {
        _id: superAdmin._id,
        name: superAdmin.name,
        address: superAdmin.address,
        email: superAdmin.email,
        role: superAdmin.role,
        token: token,
      };

      return res.status(200).json({ success: true, data });
    } else {
      return res
        .status(401)
        .json({ success: false, err: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(500)
      .json({ success: false, err: "Internal Server Error" });
  }
});

const updateSuperAdminProfile = asyncHandler(async (req, res) => {
  try {
    const superAdmin = req.user;
    const newPassword = req.body.newPassword;
    const currentPassword = req.body.currentPassword;

    if (newPassword) {
      const isPasswordValid = await superAdmin.matchPassword(currentPassword);
      if (!isPasswordValid) {
        return res
          .status(401)
          .json({ message: "Current password is incorrect" });
      }
      superAdmin.password = req.body.newPassword;
    }

    superAdmin.name = req.body.name || superAdmin.name;
    superAdmin.email = req.body.email || superAdmin.email;
    superAdmin.phoneNumber = req.body.phoneNumber || superAdmin.phoneNumber;

    await superAdmin.save();
    const updatedSuperAdmin = { ...superAdmin._doc, password: undefined };
    res.status(200).json({
      message: "superAdmin profile updated successfully",
      superAdmin: updatedSuperAdmin,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, err: "Internal Server Error" });
  }
});

const registerSuperAdmin = asyncHandler(async (req, res) => {
  try {
    const { name, email, phoneNumber, role, password } = req.body;

    const superAdminExist = await SuperAdmin.findOne({
      email: email.toLowerCase(),
    });

    if (superAdminExist) {
      return res
        .status(400)
        .json({ success: false, err: "SuperAdmin already exists" });
    } else {
      const superadmin = await SuperAdmin.create({
        name: name.toLowerCase(),
        email: email.toLowerCase(),
        phoneNumber,
        role,
        password,
      });

      if (superadmin) {
        generateSuperAdminToken(superadmin);
        const { password, ...userWithoutPassword } = superadmin._doc;
        res.status(201).json({ success: true, data: userWithoutPassword });
      } else {
        return res
          .status(400)
          .json({ success: false, err: "Email does not exist" });
      }
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, err: "Internal Server Error" });
  }
});

module.exports = {
  createUser,
  loginSuperAdmin,
  updateSuperAdminProfile,
  registerSuperAdmin,
};
