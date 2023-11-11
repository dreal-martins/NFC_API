const asyncHandler = require("express-async-handler");
const Contractor = require("../models/Contractor");
const Contract = require("../models/Contract");
const StackHolder = require("../models/StackHolder");
const generateRandomPassword = require("../utils/generatePassword");
const sendLoginDetails = require("../utils/sendLoginDetails");

// @desc Create Contractor
// route POST /admin/createcontractor
// @access Private
const createContractor = asyncHandler(async (req, res) => {
  try {
    const { name, address, email, projectType } = req.body;

    const contractorExist = await Contractor.findOne({
      contractorEmail: email.toLowerCase(),
    });

    if (contractorExist) {
      return res
        .status(400)
        .json({ success: false, err: "Contractor already exists" });
    } else {
      const randomPassword = generateRandomPassword(10);

      const contractor = await Contractor.create({
        name,
        address,
        email,
        projectType,
        password: randomPassword,
      });

      const loginDetails = {
        email: email,
        password: randomPassword,
      };

      sendLoginDetails(email, loginDetails);

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
    stakeholderId,
    name,
    status,
    description,
    startDate,
    endDate,
  } = req.body;

  const contractor = await Contractor.findById(contractorId);
  const stakeholder = await StackHolder.findById(stakeholderId);

  if (!contractor || !stakeholder) {
    return res
      .status(404)
      .json({ success: false, error: "Contractor or stakeholder not found" });
  }

  const contractExist = await Contract.findOne({
    name: name,
  });

  if (contractExist) {
    return res
      .status(400)
      .json({ success: false, err: "Contract already exists" });
  }

  const contract = await Contract.create({
    contractor: contractorId,
    stakeholder: stakeholderId,
    name,
    status,
    description,
    startDate,
    endDate,
  });

  if (!contractor.assignedContracts) {
    contractor.assignedContracts = [];
  }
  contractor.assignedContracts.push(contract);

  if (!stakeholder.assignedContracts) {
    stakeholder.assignedContracts = [];
  }
  stakeholder.assignedContracts.push(contract);

  await contractor.save();
  await stakeholder.save();

  if (contract) {
    return res.status(201).json({ success: true, data: contract });
  } else {
    return res
      .status(500)
      .json({ success: false, err: "Internal Server Error" });
  }
});

// @desc Get All Contract
// route GET /admin/contract
// @access Private
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

// @desc Create Stackholder
// route POST /admin/createstackholder
// @access Private
const createStackHolder = asyncHandler(async (req, res) => {
  try {
    const { user } = req;
    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access forbidden for non-admin users",
      });
    }

    const { name, email, role } = req.body;
    const stackholderExist = await StackHolder.findOne({
      email: email.toLowerCase(),
    });

    if (stackholderExist) {
      return res
        .status(400)
        .json({ success: false, err: "Stackholder already exists" });
    } else {
      const randomPassword = generateRandomPassword(10);

      const stackholder = await StackHolder.create({
        name,
        email,
        password: randomPassword,
        role,
      });

      const loginDetails = {
        email: email,
        password: randomPassword,
      };

      sendLoginDetails(email, loginDetails);
      if (stackholder) {
        const { password, ...userWithoutPassword } = stackholder._doc;
        res.status(200).json({ success: true, data: userWithoutPassword });
      } else {
        return res.status(400).json({
          success: false,
          message: "Error creating stackholder account.",
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, err: "Internal Server Error" });
  }
});

module.exports = {
  createContractor,
  getContractorById,
  createStackHolder,
  getAllContracts,
  getContractors,
  createContract,
};
