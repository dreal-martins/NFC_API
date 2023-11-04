const mongoose = require("mongoose");

const contractSchema = new mongoose.Schema({
  contractor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Contractor",
    required: true,
  },
  contractName: {
    type: String,
    required: true,
  },
  sponsorName: {
    type: String,
    required: true,
  },
  sponsorAddress: {
    type: String,
    required: true,
  },
  sponsorPhoneNumber: {
    type: String,
    required: true,
  },
  sponsorEmailAddress: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["new", "assigned", "in progress", "overdue"],
    default: "new",
  },
});

const Contract = mongoose.model("Contract", contractSchema);

module.exports = Contract;
