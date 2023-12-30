const asyncHandler = require("express-async-handler");
const Contractor = require("../models/Contractor");
const Contract = require("../models/Contract");
const StakeHolder = require("../models/Stakeholder");
const User = require("../models/User");
const generateRandomPassword = require("../utils/generatePassword");
const sendLoginDetails = require("../utils/sendLoginDetails");

// @desc Create Contractor
// route POST /admin/createcontractor
// @access Private
const createContractor = asyncHandler(async (req, res) => {
  try {
    const { name, address, email, projectType } = req.body;

    const contractorExist = await Contractor.findOne({
      email: email,
    });

    if (contractorExist) {
      return res
        .status(400)
        .json({ success: false, err: "Contractor already exists" });
    }

    const randomPassword = generateRandomPassword(10);
    const loginDetails = {
      email: email,
      password: randomPassword,
    };

    const emailSent = await sendLoginDetails(email, loginDetails);

    if (emailSent) {
      try {
        const contractor = await Contractor.create({
          name,
          address,
          email,
          projectType,
          password: randomPassword,
        });

        const { password, ...userWithoutPassword } = contractor._doc;
        return res
          .status(201)
          .json({ success: true, data: userWithoutPassword });
      } catch (dbError) {
        return res
          .status(500)
          .json({ success: false, err: "Error creating contractor account" });
      }
    } else {
      return res
        .status(500)
        .json({ success: false, err: "Error sending login details email" });
    }
  } catch (error) {
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
const getAllContractors = asyncHandler(async (req, res) => {
  try {
    const contractors = await Contractor.find({}).select("-password");

    const contractorCount = contractors.length;

    if (contractorCount > 0) {
      return res
        .status(200)
        .json({ success: true, contractorCount, contractors });
    } else {
      return res.status(200).json({ success: true, data: [] });
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
  try {
    const {
      contractorId,
      stakeholderId,
      createdBy,
      name,
      status,
      description,
      startDate,
      endDate,
      cost,
    } = req.body;

    const contractor = await Contractor.findById(contractorId);
    const stakeholder = await StakeHolder.findById(stakeholderId);
    const admin = await User.findById(createdBy);

    if (!contractor || !stakeholder || !admin) {
      return res.status(404).json({
        success: false,
        error: "Contractor or stakeholder or admin not found",
      });
    }

    const contract = await Contract.create({
      contractor: contractorId,
      stakeholder: stakeholderId,
      createdBy,
      name,
      status,
      description,
      startDate,
      endDate,
      cost,
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
        .json({ success: false, err: "Can't create contract" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
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
      return res.status(200).json({ success: true, data: [] });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
});

// @desc Create Stackholder
// route POST /admin/createstackholder
// @access Private
const createStakeHolder = asyncHandler(async (req, res) => {
  try {
    const { name, email, position } = req.body;

    const stackholderExist = await StakeHolder.findOne({
      email: email.toLowerCase(),
    });

    if (stackholderExist) {
      return res
        .status(400)
        .json({ success: false, err: "Stackholder already exists" });
    }

    const randomPassword = generateRandomPassword(10);

    const loginDetails = {
      email: email,
      password: randomPassword,
    };

    const emailSent = await sendLoginDetails(email, loginDetails);

    if (emailSent) {
      try {
        const stackholder = await StakeHolder.create({
          name,
          email,
          password: randomPassword,
          position,
        });

        const { password, ...userWithoutPassword } = stackholder._doc;
        return res
          .status(201)
          .json({ success: true, data: userWithoutPassword });
      } catch (dbError) {
        console.log(dbError);
        return res
          .status(500)
          .json({ success: false, err: "Error creating stackholder account" });
      }
    } else {
      return res
        .status(500)
        .json({ success: false, err: "Error sending login details email" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, err: "Internal Server Error" });
  }
});

// @desc Get All Stakeholders
// route Get /admin/stackholder
// @access Private
const getAllStakeholders = asyncHandler(async (req, res) => {
  try {
    const stackholders = await StakeHolder.find({}).select("-password");

    const stackholderCount = stackholders.length;

    if (stackholderCount > 0) {
      return res
        .status(200)
        .json({ success: true, stackholderCount, stackholders });
    } else {
      return res.status(200).json({ success: true, data: [] });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
});

// @desc Get a contractor profile
// route GET /admin/stackholder/:id
// @access Private
const getStakeholderById = asyncHandler(async (req, res) => {
  try {
    const stakeholderId = req.params.stakeholderId;
    if (stakeholderId) {
      const stakeholder = await StakeHolder.findById(stakeholderId).select(
        "-password"
      );
      if (!stakeholder) {
        return res
          .status(404)
          .json({ success: false, message: "Stakeholder not found" });
      } else {
        return res.status(200).json({ success: true, stakeholder });
      }
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, err: "Internal Server Error" });
  }
});

// @desc delete contract
// route GET /admin/contract/:id
// @access Private
const deleteContract = asyncHandler(async (req, res) => {
  try {
    const contractId = req.params.contractId;

    if (contractId) {
      const contract = await Contract.findByIdAndRemove(contractId);
      if (!contract) {
        return res
          .status(404)
          .json({ success: false, message: "Contract not found" });
      } else {
        return res
          .status(200)
          .json({ success: true, message: "Contract delete sucessfully" });
      }
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, err: "Internal Server Error" });
  }
});

// @desc get all user
// route GET /admin/users
// @access Private
const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find();
    const contractors = await Contractor.find();
    const stakeholders = await StakeHolder.find();

    const usersCount = users.length;
    const contractorsCount = contractors.length;
    const stakeholdersCount = stakeholders.length;

    res.json({
      users: { data: users, count: usersCount },
      contractors: { data: contractors, count: contractorsCount },
      stakeholders: { data: stakeholders, count: stakeholdersCount },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = {
  createContractor,
  getContractorById,
  createStakeHolder,
  getAllContracts,
  getAllStakeholders,
  getAllContractors,
  getStakeholderById,
  getAllUsers,
  deleteContract,
  createContract,
};
