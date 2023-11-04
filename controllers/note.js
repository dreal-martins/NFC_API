const asyncHandler = require("express-async-handler");
const Note = require("../models/Note");

const createNote = asyncHandler(async (req, res) => {
  try {
    const { name, note, contractId } = req.body;

    const newNote = await Note.create({
      name,
      note,
      contract: contractId,
    });

    res.status(201).json({ success: true, data: newNote });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, err: "Internal Server Error" });
  }
});

const getNotesByContract = asyncHandler(async (req, res) => {
  try {
    const { contractId } = req.params;

    const notes = await Note.find({ contract: contractId });
    const noteCount = notes.length;

    if (!notes) {
      return res
        .status(404)
        .json({ success: false, message: "Note not found" });
    } else {
      return res.status(200).json({ success: true, noteCount, notes });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, err: "Internal Server Error" });
  }
});
module.exports = {
  getNotesByContract,
  createNote,
};
