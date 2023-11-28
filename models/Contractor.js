const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const contractorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  projectType: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    require: true,
  },
  assignedContracts: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Contract" },
  ],
});

contractorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

contractorSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Contractor = mongoose.model("Contractor", contractorSchema);
module.exports = Contractor;
