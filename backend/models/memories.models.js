const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const memorySchema = new Schema({
  color: {
    type: String,
    required: true,
    trim: true
  },
  description: { type: String, required: true, trim: true }
});

const Memories = mongoose.model("Memories", memorySchema);

module.exports = Memories;
