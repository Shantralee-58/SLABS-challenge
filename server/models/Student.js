const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: String,
  email: String,
  dateOfBirth: String,
  course: String,
  contact: String,
  address: String,
  province: String,
  score: Number,
  totalQuestions: Number,
  percent: Number,
  status: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Student", studentSchema);

