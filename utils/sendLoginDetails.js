const nodemailer = require("nodemailer");

const sendLoginDetailsEmail = (contractorEmail, loginDetails) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.ADMIN_EMAIL,
      pass: process.env.ADMIN_EMAIL_PASSKEY,
    },
  });

  const mailOptions = {
    from: process.env.ADMIN_EMAIL,
    to: contractorEmail,
    subject: "Login Details",
    text: `Your login details:\nEmail: ${loginDetails.email}\nPassword: ${loginDetails.password}`,
  };
  transporter.sendMail(mailOptions);
};

module.exports = sendLoginDetailsEmail;
