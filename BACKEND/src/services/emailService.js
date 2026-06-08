const nodemailer = require("nodemailer");
const { GMAIL } = require("../config/sendEmail");

const sendEmail = async (email, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com", // Correct host for Gmail
      port: 587,
      secure: false, // Use true for port 465
      auth: {
        user: GMAIL.user,
        pass: GMAIL.pass,
      },
    });

    const mailOptions = {
      from: "Green Flag",
      to: email,
      subject,
      html,
    };

    const infor = await transporter.sendMail(mailOptions);
    return infor;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  sendEmail,
};
