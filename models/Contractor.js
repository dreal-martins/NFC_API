const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const contractorSchema = new mongoose.Schema({
  contractorCompanyName: {
    type: String,
    required: true,
  },
  contractorCompanyAddress: {
    type: String,
    required: true,
  },
  contractorEmail: {
    type: String,
    required: true,
  },
  contractorProjectType: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    require: true,
  },
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

const Contractor = mongoose.model("Contractors", contractorSchema);
module.exports = Contractor;
