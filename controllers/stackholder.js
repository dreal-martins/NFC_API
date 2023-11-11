const asyncHandler = require("express-async-handler");
const StackHolder = require("../models/StackHolder");
const { generateStackholderToken } = require("../utils/generateToken");

const loginStackholder = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    const stackholder = await StackHolder.findOne({ email });
    if (stackholder && (await stackholder.matchPassword(password))) {
      const token = generateStackholderToken(stackholder);

      res.cookie("jwtStackholder", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      const data = {
        _id: stackholder._id,
        name: stackholder.name,
        email: stackholder.email,
        role: stackholder.role,
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

const updateStackholder = asyncHandler(async (req, res) => {
  try {
    const stackholder = req.user;
    const newPassword = req.body.newPassword;
    const currentPassword = req.body.currentPassword;
    if (newPassword) {
      const isPasswordValid = await stackholder.matchPassword(currentPassword);
      if (!isPasswordValid) {
        return res
          .status(401)
          .json({ message: "Current password is incorrect" });
      }
      stackholder.password = req.body.newPassword;
    }
    stackholder.name = req.body.name || stackholder.name;
    stackholder.email = req.body.email || stackholder.email;
    stackholder.role = req.body.role || stackholder.role;

    await stackholder.save();
    const updatedStackholder = { ...stackholder._doc, password: undefined };
    res.status(200).json({
      message: "Stackholder profile updated successfully",
      stackholder: updatedStackholder,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, err: "Internal Server Error" });
  }
});

module.exports = { loginStackholder, updateStackholder };
