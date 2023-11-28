const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Contractor = require("../models/Contractor");
const StackHolder = require("../models/Stakeholder");

const getTokenFromHeader = (req) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.split(" ")[1];
  }
  return null;
};

const protect = asyncHandler(async (req, res, next) => {
  try {
    const token = getTokenFromHeader(req);

    if (!token) {
      return res.status(401).json({ err: "Not authorized, no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded._id).select("-password");
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ err: "Not authorized, invalid token" });
  }
});

const protectContractor = asyncHandler(async (req, res, next) => {
  try {
    const token = getTokenFromHeader(req);

    if (!token) {
      return res.status(401).json({ err: "Not authorized, no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const contractor = await Contractor.findById(decoded._id);

    if (!contractor) {
      return res.status(401).json({ err: "Not authorized, invalid token" });
    }

    req.user = contractor;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ err: "Not authorized, invalid token" });
  }
});

const protectStackholder = asyncHandler(async (req, res, next) => {
  try {
    const token = getTokenFromHeader(req);

    if (!token) {
      return res.status(401).json({ err: "Not authorized, no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const stackholder = await StackHolder.findById(decoded._id);

    if (!stackholder) {
      return res.status(401).json({ err: "Not authorized, invalid token" });
    }

    req.user = stackholder;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ err: "Not authorized, invalid token" });
  }
});

const isAdmin = asyncHandler(async (req, res, next) => {
  try {
    const token = getTokenFromHeader(req);

    if (!token) {
      return res.status(401).json({ err: "Not authorized, no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id).select("-password");

    if (!user || user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Access forbidden for non-admin users." });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ err: "Not authorized, invalid token" });
  }
});

module.exports = { protect, isAdmin, protectContractor, protectStackholder };
