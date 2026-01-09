const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const path = require("path");
require('dotenv').config(); // Load environment variables

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

// -------------------- EMAIL CONFIG --------------------
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

// Verify transporter on startup
transporter.verify((error, success) => {
  if (error) {
    console.error("Email transporter verification failed:", error);
  } else {
    console.log("Email transporter ready to send messages");
  }
});

// -------------------- SUBMIT RESULTS --------------------
app.post("/submit-results", async (req, res) => {
  const { studentName, studentEmail, studentCourse, score, totalQuestions, percent } = req.body;

  if (!studentName || !studentEmail) {
    return res.status(400).send({ status: "error", message: "Student name and email required" });
  }

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: studentEmail,                 // Student
    cc: process.env.ADMIN_EMAIL,      // Admin
    subject: `SouthernLabs Challenge Results: ${studentName}`,
    html: `
      <h2>SouthernLabs Challenge Results</h2>
      <p><strong>Student:</strong> ${studentName}</p>
      <p><strong>Email:</strong> ${studentEmail}</p>
      <p><strong>Course:</strong> ${studentCourse}</p>
      <p><strong>Score:</strong> ${score}/${totalQuestions} (${percent}%)</p>
      <p><strong>Status:</strong> ${percent >= 60 ? 'PASSED ✅' : 'FAILED ❌'}</p>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.response);
    res.send({ status: "success", message: "Email sent successfully" });
  } catch (err) {
    console.error("Failed to send email:", err);
    res.status(500).send({ status: "error", message: err.message });
  }
});

// -------------------- START SERVER --------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

