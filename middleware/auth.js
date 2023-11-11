const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Contractor = require("../models/Contractor");
const StackHolder = require("../models/StackHolder");

const protect = asyncHandler(async (req, res, next) => {
  let token;
  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded._id).select("-password");
      next();
    } catch (error) {
      console.log(error);
      return res.status(401).json({ err: "Not authorized, invalid token" });
    }
  } else {
    return res.status(401).json({ err: "Not authorized, no token" });
  }
});

const protectContractor = async (req, res, next) => {
  let token;
  token = req.cookies.jwtContractor;

  try {
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const contractor = await Contractor.findById(decoded._id);
      req.user = contractor;

      next();
    } else {
      return res.status(401).json({ err: "Not authorized, no token" });
    }
  } catch (error) {
    console.log(error);
    return res.status(401).json({ err: "Not authorized, invalid token" });
  }
};

const protectStackholder = async (req, res, next) => {
  let token;
  token = req.cookies.jwtStackholder;

  try {
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const stackholder = await StackHolder.findById(decoded._id);
      req.user = stackholder;

      next();
    } else {
      return res.status(401).json({ err: "Not authorized, no token" });
    }
  } catch (error) {
    console.log(error);
    return res.status(401).json({ err: "Not authorized, invalid token" });
  }
};

const isAdmin = asyncHandler(async (req, res, next) => {
  let token;
  token = req.cookies.jwt;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded._id).select("-password");
      if (user.role === "admin") {
        next();
      } else {
        res
          .status(403)
          .json({ message: "Access forbidden for non-admin users." });
      }
    } catch (error) {
      console.log(error);
      return res.status(401).json({ err: "Not authorized, invalid token" });
    }
  } else {
    return res.status(401).json({ err: "Not authorized, no token" });
  }
});

module.exports = { protect, isAdmin, protectContractor, protectStackholder };
