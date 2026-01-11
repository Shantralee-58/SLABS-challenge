const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: String,
  email: String,
  idNumber: String,
  age: Number,
  course: String,
  contact: String,
  address: String,
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

