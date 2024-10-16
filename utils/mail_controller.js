const nodemailer = require("nodemailer");
require("dotenv").config();
const ejs = require("ejs");
const fs = require("fs");
const path = require("path");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // Gmail SMTP server
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // Add this line
  },
});

const sendMail = (user, subject, message, status) => {
  try {
    const templatePath = path.join(__dirname, "email_template.ejs");
    console.log(user.email);
    console.log(process.env.GMAIL_USER);
    console.log(process.env.GMAIL_PASS);
    const emailParams = {
      from: "Kwanza",
      to: user.email,
      subject: subject,
      html: ejs.render(fs.readFileSync(templatePath, "utf8"), {
        subject: subject,
        message: message,
        status: status,
      }),
    };
    const response = transporter.sendMail(emailParams);
    return response;
  } catch (error) {
    console.log(error);
  }
};
module.exports = { sendMail };
