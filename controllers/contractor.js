const asyncHandler = require("express-async-handler");
const Contractor = require("../models/Contractor");
const { generateContractorToken } = require("../utils/generateToken");

const loginContractor = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    const contractor = await Contractor.findOne({ email });
    if (contractor && (await contractor.matchPassword(password))) {
      const token = generateContractorToken(contractor);

      res.setHeader("Authorization", `Bearer ${token}`);

      const data = {
        _id: contractor._id,
        name: contractor.name,
        address: contractor.address,
        email: contractor.email,
        ProjectType: contractor.projectType,
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

const updateContractorProfile = asyncHandler(async (req, res) => {
  try {
    const contractor = req.user;
    const newPassword = req.body.newPassword;
    const currentPassword = req.body.currentPassword;

    if (newPassword) {
      const isPasswordValid = await contractor.matchPassword(currentPassword);
      if (!isPasswordValid) {
        return res
          .status(401)
          .json({ message: "Current password is incorrect" });
      }
      contractor.password = req.body.newPassword;
    }

    contractor.contractorCompanyName =
      req.body.contractorCompanyName || contractor.contractorCompanyName;
    contractor.contractorCompanyAddress =
      req.body.contractorCompanyAddress || contractor.contractorCompanyAddress;
    contractor.contractorProjectType =
      req.body.contractorProjectType || contractor.contractorProjectType;

    await contractor.save();
    const updatedContractor = { ...contractor._doc, password: undefined };
    res.status(200).json({
      message: "Contractor profile updated successfully",
      contractor: updatedContractor,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, err: "Internal Server Error" });
  }
});

module.exports = {
  loginContractor,
  updateContractorProfile,
};
