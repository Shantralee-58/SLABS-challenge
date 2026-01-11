const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();
const mongoose = require("mongoose");
const Student = require("./models/Student");
const sgMail = require("@sendgrid/mail");

const app = express();

// -------------------- MIDDLEWARE --------------------
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../public")));

// -------------------- ENV VALIDATION --------------------
if (!process.env.SENDGRID_API_KEY) {
  console.error("❌ SENDGRID_API_KEY not set in .env");
  process.exit(1);
}

if (!process.env.ADMIN_EMAIL) {
  console.error("❌ ADMIN_EMAIL not set in .env");
  process.exit(1);
}

if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI not set in .env");
  process.exit(1);
}

// -------------------- SENDGRID CONFIG --------------------
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// -------------------- MONGODB CONNECT --------------------
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });

// -------------------- SUBMIT RESULTS --------------------
app.post("/submit-results", async (req, res) => {
  const {
    studentName,
    studentEmail,
    studentID,
    studentAge,
    studentCourse,
    studentContact,
    studentAddress,
    score,
    totalQuestions,
    percent
  } = req.body;

  // ---------- Validation ----------
  if (!studentName || !studentEmail || !studentID || !studentAge) {
    return res.status(400).json({
      status: "error",
      message: "Missing required student information"
    });
  }

  try {
    // ---------- Save to MongoDB ----------
    const newStudent = new Student({
      name: studentName,
      email: studentEmail,
      idNumber: studentID,
      age: studentAge,
      course: studentCourse,
      contact: studentContact,
      address: studentAddress,
      score,
      totalQuestions,
      percent,
      status: percent >= 60 ? "PASSED" : "FAILED",
      createdAt: new Date()
    });

    await newStudent.save();
    console.log("✅ Student saved to database");

    // ---------- Send Email ----------
    const msg = {
      to: [process.env.ADMIN_EMAIL, studentEmail],
      from: process.env.ADMIN_EMAIL, // must be verified in SendGrid
      subject: `SouthernLabs Challenge Results: ${studentName}`,
      html: `
        <h2>SouthernLabs Challenge Results</h2>
        <hr>

        <p><strong>Student:</strong> ${studentName}</p>
        <p><strong>Email:</strong> ${studentEmail}</p>
        <p><strong>ID / Passport:</strong> ${studentID}</p>
        <p><strong>Age:</strong> ${studentAge}</p>
        <p><strong>Course:</strong> ${studentCourse}</p>
        <p><strong>Contact:</strong> ${studentContact}</p>
        <p><strong>Address:</strong> ${studentAddress}</p>

        <hr>

        <p><strong>Score:</strong> ${score}/${totalQuestions} (${percent}%)</p>
        <p><strong>Status:</strong> ${percent >= 60 ? "PASSED ✅" : "FAILED ❌"}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
      `
    };

    await sgMail.send(msg);
    console.log("✅ Email sent");

    res.json({
      status: "success",
      message: "Results saved and email sent successfully"
    });

  } catch (error) {
    console.error("❌ Submit Error:", error);

    res.status(500).json({
      status: "error",
      message: "Failed to submit results"
    });
  }
});

// -------------------- START SERVER --------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

