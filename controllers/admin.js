const asyncHandler = require("express-async-handler");
const Contractor = require("../models/Contractor");
const Contract = require("../models/Contract");
const generateRandomPassword = require("../utils/generatePassword");
const sendLoginDetailsToContractor = require("../utils/sendLoginDetails");

// @desc Create Contract
// route POST /admin/createcontract
// @access Private
const createContractor = asyncHandler(async (req, res) => {
  try {
    const {
      contractorCompanyName,
      contractorCompanyAddress,
      contractorEmail,
      contractorProjectType,
    } = req.body;

    const contractorExist = await Contractor.findOne({
      contractorEmail: contractorEmail.toLowerCase(),
    });

    if (contractorExist) {
      return res
        .status(400)
        .json({ success: false, err: "Contractor already exists" });
    } else {
      const randomPassword = generateRandomPassword(10);

      const contractor = await Contractor.create({
        contractorCompanyName,
        contractorCompanyAddress,
        contractorEmail,
        contractorProjectType,
        password: randomPassword,
      });

      const loginDetails = {
        email: contractorEmail,
        password: randomPassword,
      };

      sendLoginDetailsToContractor(contractorEmail, loginDetails);

      if (contractor) {
        const { password, ...userWithoutPassword } = contractor._doc;
        res.status(201).json({ success: true, data: userWithoutPassword });
      } else {
        return res.status(400).json({
          success: false,
          message: "Error creating contractor account.",
        });
      }
    }
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(500)
      .json({ success: false, err: "Internal Server Error" });
  }
});

// @desc Get a contractor profile
// route GET /admin/contract/:id
// @access Private
const getContractorById = asyncHandler(async (req, res) => {
  try {
    const contractorId = req.params.contractorId;
    if (contractorId) {
      const contractor = await Contractor.findById(contractorId).select(
        "-password"
      );
      if (!contractor) {
        return res
          .status(404)
          .json({ success: false, message: "Contractor not found" });
      } else {
        return res.status(200).json({ success: true, contractor });
      }
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, err: "Internal Server Error" });
  }
});

// @desc Get All Contractors
// route Get /admin/contractors
// @access Private
const getContractors = asyncHandler(async (req, res) => {
  try {
    const contractors = await Contractor.find({});

    const contractorCount = contractors.length;

    if (contractorCount > 0) {
      return res
        .status(200)
        .json({ success: true, contractorCount, contractors });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "No Contracts Found" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
});

// @desc Create Contract
// route POST /admin/createcontract
// @access Private
const createContract = asyncHandler(async (req, res) => {
  const { user } = req;

  if (user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access forbidden for non-admin users",
    });
  }

  const {
    contractorId,
    contractName,
    sponsorName,
    sponsorEmailAddress,
    sponsorAddress,
    sponsorPhoneNumber,
    description,
    startDate,
    endDate,
    status,
  } = req.body;

  const contractor = await Contractor.findById(contractorId);

  if (!contractor) {
    return res
      .status(404)
      .json({ success: false, err: "Contractor not found" });
  }

  const contractExist = await Contract.findOne({
    contractName: contractName.toLowerCase(),
  });

  if (contractExist) {
    return res
      .status(400)
      .json({ success: false, err: "Contract already exists" });
  }

  const contract = await Contract.create({
    contractor: contractorId,
    contractName,
    sponsorName,
    sponsorEmailAddress,
    sponsorAddress,
    sponsorPhoneNumber,
    description,
    startDate,
    endDate,
    status,
  });

  if (contract) {
    return res.status(201).json({ success: true, data: contract });
  } else {
    return res
      .status(500)
      .json({ success: false, err: "Internal Server Error" });
  }
});

const getAllContracts = asyncHandler(async (req, res) => {
  try {
    const contracts = await Contract.find({});

    const contractCount = contracts.length;

    if (contractCount > 0) {
      return res.status(200).json({ success: true, contractCount, contracts });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "No Contracts Found" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
});

module.exports = {
  createContractor,
  getContractorById,
  getAllContracts,
  getContractors,
  createContract,
};
