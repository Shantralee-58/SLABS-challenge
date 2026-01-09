const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const path = require("path");

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,'../public')));

// -------------------- EMAIL CONFIG --------------------
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'yourgmail@gmail.com',     // YOUR EMAIL
    pass: 'your_app_password'        // App Password (2FA recommended)
  }
});

// -------------------- SUBMIT RESULTS --------------------
app.post("/submit-results", (req,res)=>{
  const {studentName, studentEmail, studentCourse, score, totalQuestions, percent} = req.body;
  const mailOptions = {
    from: 'yourgmail@gmail.com',
    to: `idah@southernlabs.com, ${studentEmail}`,
    subject: `SouthernLabs Challenge Results: ${studentName}`,
    html: `
      <h2>SouthernLabs Challenge Results</h2>
      <p><strong>Student:</strong> ${studentName}</p>
      <p><strong>Email:</strong> ${studentEmail}</p>
      <p><strong>Course:</strong> ${studentCourse}</p>
      <p><strong>Score:</strong> ${score}/${totalQuestions} (${percent}%)</p>
      <p><strong>Status:</strong> ${percent>=60?'PASSED ✅':'FAILED ❌'}</p>
    `
  };
  transporter.sendMail(mailOptions,(err,info)=>{
    if(err){ console.error(err); res.status(500).send("Error sending email"); return; }
    res.send({status:"success", info});
  });
});

app.listen(3000,()=>console.log("Server running on http://localhost:3000"));

