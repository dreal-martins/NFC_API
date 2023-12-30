const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const stakeHolderSchema = new mongoose.Schema({
  name: String,
  email: String,
  position: String,
  password: {
    type: String,
    require: true,
  },
  assignedContracts: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Contract" },
  ],
});

stakeHolderSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

stakeHolderSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Stakeholder = mongoose.model("Stakeholder", stakeHolderSchema);
module.exports = Stakeholder;
