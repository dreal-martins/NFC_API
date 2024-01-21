const mongoose = require("mongoose");

const contractSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  status: {
    type: String,
    enum: ["new", "completed"],
    default: "new",
  },
  description: {
    type: String,
    require: true,
  },
  startDate: {
    type: String,
    required: true,
  },
  endDate: {
    type: String,
    required: true,
  },
  cost: {
    type: String,
    required: true,
  },
  contractor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Contractor",
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  stakeholder: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stakeholder",
      required: true,
    },
  ],
});

const Contract = mongoose.model("Contract", contractSchema);

module.exports = Contract;
