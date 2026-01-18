const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
  name: String,
  email: String,
  dateOfBirth: String,
  province: String,
  course: String,
  contact: String,
  address: String,

  score: Number,
  totalQuestions: Number,
  percent: Number,
  status: String,

  registeredAt: Date,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Student", StudentSchema);

