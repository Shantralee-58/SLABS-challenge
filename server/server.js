const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
require('dotenv').config();
const sgMail = require("@sendgrid/mail");

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,'../public')));

// -------------------- SENDGRID CONFIG --------------------
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// -------------------- SUBMIT RESULTS --------------------
app.post("/submit-results", async (req, res) => {
  const { studentName, studentEmail, studentCourse, score, totalQuestions, percent } = req.body;

  const msg = {
    to: [process.env.ADMIN_EMAIL, studentEmail], // send to admin and student
    from: process.env.ADMIN_EMAIL,               // must be verified in SendGrid
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
    await sgMail.send(msg);
    console.log("Email sent successfully");
    res.send({ status: "success", message: "Email sent successfully" });
  } catch (error) {
    console.error("Failed to send email:", error);
    res.status(500).send({ status: "error", message: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port", PORT));

