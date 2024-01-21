const asyncHandler = require("express-async-handler");
const Contract = require("../models/Contract");
const Note = require("../models/Note");

//   try {
//     const contractorId = req.params.contractorId;

//     const contracts = await Contract.find({
//       contractor: contractorId,
//     });
//     const contractCount = contracts.length;

//     if (!contracts) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Contract not found" });
//     } else {
//       return res
//         .status(200)
//         .json({ success: true, contractCount, data: contracts });
//     }
//   } catch (error) {
//     console.log(error);
//     return res
//       .status(500)
//       .json({ success: false, err: "Internal Server Error" });
//   }
// });

const getContractsByContractor = asyncHandler(async (req, res) => {
  try {
    const contractorId = req.params.contractorId;

    // Find contracts by contractorId
    const contracts = await Contract.find({ contractor: contractorId });

    const contractCount = contracts.length;

    if (!contracts) {
      return res
        .status(404)
        .json({ success: false, message: "Contract not found" });
    } else {
      // Fetch associated notes for each contract
      const contractsWithNotes = await Promise.all(
        contracts.map(async (contract) => {
          const notes = await Note.find({ contract: contract._id });
          return { ...contract.toObject(), notes };
        })
      );

      return res
        .status(200)
        .json({ success: true, contractCount, data: contractsWithNotes });
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
      // Fetch associated notes for each contract
      const contractsWithNotes = await Promise.all(
        contracts.map(async (contract) => {
          const notes = await Note.find({ contract: contract._id });
          return { ...contract.toObject(), notes };
        })
      );

      return res
        .status(200)
        .json({ success: true, contractCount, data: contractsWithNotes });
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

const changeContractStatus = asyncHandler(async (req, res) => {
  const { contractId } = req.params;
  try {
    const contract = await Contract.findById(contractId);

    if (!contract) {
      return res
        .status(404)
        .json({ success: false, message: "Contract not found" });
    }

    contract.status = "completed";

    await contract.save();

    return res.json({
      success: true,
      message: "Contract status updated to completed",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
});

module.exports = {
  getContractsByContractor,
  getContractsByStakeHolder,
  getContractsByAdmin,
  changeContractStatus,
};
