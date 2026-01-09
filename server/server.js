const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const path = require("path");
require('dotenv').config();  // Load .env variables

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,'../public')));

// -------------------- EMAIL CONFIG --------------------
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

// -------------------- SUBMIT RESULTS --------------------
app.post("/submit-results", (req, res) => {
  const { studentName, studentEmail, studentCourse, score, totalQuestions, percent } = req.body;

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: `${process.env.ADMIN_EMAIL}, ${studentEmail}`,  // CC to admin
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

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error("Email error:", err);
      res.status(500).send({ status: "error", message: err.message });
      return;
    }
    console.log("Email sent:", info.response);
    res.send({ status: "success", message: "Email sent successfully" });
  });
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));

