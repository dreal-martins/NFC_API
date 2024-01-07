const asyncHandler = require("express-async-handler");
const Contract = require("../models/Contract");

const getContractsByContractor = asyncHandler(async (req, res) => {
  try {
    const contractorId = req.params.contractorId;

    const contracts = await Contract.find({ contractor: contractorId });
    const contractCount = contracts.length;

    if (!contracts) {
      return res
        .status(404)
        .json({ success: false, message: "Contract not found" });
    } else {
      return res
        .status(200)
        .json({ success: true, contractCount, data: contracts });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, err: "Internal Server Error" });
  }
});

const getContractsByStakeHolder = asyncHandler(async (req, res) => {
  try {
    const stackholderId = req.params.stackholderId;

    const contracts = await Contract.find({ stackholder: stackholderId });
    const contractCount = contracts.length;
    if (!contracts) {
      return res
        .status(404)
        .json({ success: false, message: "Contract not found" });
    } else {
      return res
        .status(200)
        .json({ success: true, contractCount, data: contracts });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, err: "Internal Server Error" });
  }
});

const getContractsByAdmin = asyncHandler(async (req, res) => {
  try {
    const adminId = req.params.adminId;

    const contracts = await Contract.find({ admin: adminId });
    const contractCount = contracts.length;
    if (!contracts) {
      return res
        .status(404)
        .json({ success: false, message: "Contract not found" });
    } else {
      return res
        .status(200)
        .json({ success: true, contractCount, data: contracts });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, err: "Internal Server Error" });
  }
});

module.exports = {
  getContractsByContractor,
  getContractsByStakeHolder,
  getContractsByAdmin,
};
