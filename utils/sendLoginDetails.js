const nodemailer = require("nodemailer");

const sendLoginDetailsEmail = async (email, loginDetails) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.ADMIN_EMAIL,
      pass: process.env.ADMIN_EMAIL_PASSKEY,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: process.env.ADMIN_EMAIL,
    to: email,
    subject: "Login Details",
    text: `Your login details:\nEmail: ${loginDetails.email}\nPassword: ${loginDetails.password}`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    return false;
  }
};

module.exports = sendLoginDetailsEmail;
