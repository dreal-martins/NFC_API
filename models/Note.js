const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  name: String,
  note: String,
  status: {
    type: String,
    enum: ["pending approval", "approved", "rejected"],
    default: "pending",
  },
  contract: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Contract",
    required: true,
  },
});

const Note = mongoose.model("Note", noteSchema);

module.exports = Note;
