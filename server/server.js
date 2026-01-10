const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
require('dotenv').config();
const sgMail = require("@sendgrid/mail");

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,'../public')));

// -------------------- SENDGRID CONFIG --------------------
if (!process.env.SENDGRID_API_KEY) {
  console.error("Error: SENDGRID_API_KEY not set in environment variables!");
  process.exit(1);
}
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

if (!process.env.ADMIN_EMAIL) {
  console.error("Error: ADMIN_EMAIL not set in environment variables!");
  process.exit(1);
}

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

  if (!studentName || !studentEmail || !studentID || !studentAge) {
    return res.status(400).send({
      status: "error",
      message: "Missing required student information"
    });
  }

  const msg = {
    to: [process.env.ADMIN_EMAIL, studentEmail], // admin + student
    from: process.env.ADMIN_EMAIL,               // must be verified in SendGrid
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
      <p><strong>Status:</strong> ${percent >= 60 ? 'PASSED ✅' : 'FAILED ❌'}</p>
      <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
    `
  };

  try {
    const response = await sgMail.send(msg);
    console.log("Email sent successfully:", response[0].statusCode);

    res.send({
      status: "success",
      message: "Results submitted and email sent"
    });

  } catch (error) {
    console.error("SendGrid Error:", error.response?.body || error.message);

    res.status(500).send({
      status: "error",
      message: "Failed to send results email"
    });
  }
});


// -------------------- START SERVER --------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port", PORT));

