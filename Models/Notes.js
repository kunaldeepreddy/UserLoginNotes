const mongoose = require("mongoose");

const notesSchema = new mongoose.Schema({
  text: { type: String ,required: [true, 'text is required.'] },
  userId: { type: String ,required: [true, 'userId is required.'] },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
  name: { type: String ,required: [true, 'notes name is required.'] }
});

module.exports = mongoose.model("Notes", notesSchema);