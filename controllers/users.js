const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const { generateUserToken } = require("../utils/generateToken");
const jwt = require("jsonwebtoken");

// @desc Auth User/Set token
// route POST /users/login
// @access Public
const authUser = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      const token = generateUserToken(user);

      res.setHeader("Authorization", `Bearer ${token}`);

      const data = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: token,
      };

      return res.status(200).json({ success: true, data });
    } else {
      return res
        .status(401)
        .json({ success: false, err: "Invalid email or password" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, err: "Internal Server Error" });
  }
});

// @desc Register a new user
// route POST /users
// @access Public
const registerUser = asyncHandler(async (req, res) => {
  try {
    const { name, email, phoneNumber, role, password } = req.body;

    const userExist = await User.findOne({ email: email.toLowerCase() });

    if (userExist) {
      return res
        .status(400)
        .json({ success: false, err: "User already exists" });
    } else {
      const user = await User.create({
        name: name.toLowerCase(),
        email: email.toLowerCase(),
        phoneNumber,
        role,
        password,
      });

      if (user) {
        generateUserToken(user._id);
        const { password, ...userWithoutPassword } = user._doc;
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

// @desc Logout user
// route POST /users/logout
// @access Public
const logoutUser = asyncHandler(async (req, res) => {
  try {
    res.cookie("jwt", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    res.status(200).json({ sucess: true, message: "User logged out" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, err: "Internal Server Error" });
  }
});

// @desc Get users profiles
// route GET /users/profiles
// @access Private
const getUserProfiles = asyncHandler(async (req, res) => {
  try {
    const users = await User.find({}).select("-password");

    if (users) {
      const userCount = users.length;
      return res.status(200).json({ success: true, userCount, users });
    } else {
      return res.status(404).json({ success: false, message: "No User Found" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, err: "Internal Server Error" });
  }
});

// @desc Get user profile
// route GET /users/profiles/:id
// @access Private
const getUserById = asyncHandler(async (req, res) => {
  try {
    const userId = req.params.userId;
    if (userId) {
      const user = await User.findById(userId).select("-password");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      } else {
        return res.status(200).json({ sucess: true, user });
      }
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, err: "Internal Server Error" });
  }
});

// @desc Update user profile
// route PUT /api/users/profile
// @access Private
const updateUserProfile = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
      user.role = req.body.role || user.role;
      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      const data = {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        phoneNumber: updatedUser.phoneNumber,
      };

      res.status(200).json({ sucess: true, data: data });
    } else {
      return res.status(404).json({ success: false, err: "User not found" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, err: "Internal Server Error" });
  }
});

module.exports = {
  authUser,
  registerUser,
  logoutUser,
  getUserProfiles,
  getUserById,
  updateUserProfile,
};
