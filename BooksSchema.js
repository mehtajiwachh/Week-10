const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
  booktitle: { type: String, required: true },
  author: { type: String, required: true },
  formate: { type: String, required: true },
  Topic: { type: String, required: true },
  PubYear: { type: Number, required: true },
});

module.exports = mongoose.model("Books", BookSchema);
