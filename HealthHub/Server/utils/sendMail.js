const nodemailer = require("nodemailer");

const sendMail = async ({ from, to, subject, text }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from,
    to,
    subject,
    text,
  });
};

module.exports = sendMail;