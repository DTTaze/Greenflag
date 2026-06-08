const { sendEmail } = require("../services/emailService");
const jwt = require("jsonwebtoken");
const db = require("../models/index.js");
const User = db.User;
const Role = db.Role;
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);
const { redisClient } = require("../config/configRedis");
const NotFoundError = require("../errors/NotFoundError");
const BadRequestError = require("../errors/BadRequestError");

const googleAuthCallback = async (user) => {
  let today = new Date();
  today.setHours(0, 0, 0, 0);
  let todayStr = today.toISOString().split("T")[0];

  const userWithRoles = await User.findOne({
    where: { id: user.id },
    include: [
      {
        model: Role,
        as: "roles",
        attributes: ["id", "name"],
      },
    ],
  });

  const payload = {
    id: user.id,
    role_id: userWithRoles.role_id,
    role_name: userWithRoles.roles?.name,
    username: user.username,
    email: user.email,
    full_name: user.full_name,
    phone_number: user.phone_number,
    address: user.address,
    coins_id: user.coins_id,
    streak: user.streak,
    last_completed_task: user.last_completed_task,
    avatar_url: user.avatar_url,
    google_id: user.google_id,
  };

  const access_token = jwt.sign(payload, process.env.JWT_AT_SECRET, {
    expiresIn: process.env.JWT_AT_EXPIRE,
  });
  const refresh_token = jwt.sign(payload, process.env.JWT_RF_SECRET, {
    expiresIn: process.env.JWT_RF_EXPIRE,
  });
  return {
    access_token,
    refresh_token,
    user: payload,
  };
};

const generateToken = (email) => {
  return jwt.sign({ email }, process.env.JWT_AT_SECRET, { expiresIn: "1h" });
};

const sendResetEmail = async (Email) => {
  const user = await User.findOne({ where: { email: Email } });
  if (!user) {
    throw new NotFoundError("Email not found");
  }
  const token = generateToken(Email);
  const frontedURL = process.env.FRONTEND_URL;
  const resetLink = `${frontedURL}/forgot_password?token=${token}`;
  console.log("Reset link: ", resetLink);
  console.log("Sending email to:", Email);

  const htmlContent = `
    <h1>Reset Password</h1>
    <p>Click the link below to reset your password:</p>
    <a href="${resetLink}">Reset Password</a>
    <p>If you did not request this, please ignore this email.</p>
    <p>Thank you!</p>
  `;

  const response = await sendEmail(Email, "Reset Password", htmlContent);
  return response;
};

const resetPassword = async (token, newPassword) => {
  const decoded = jwt.verify(token, process.env.JWT_AT_SECRET);
  const email = decoded.email;
  const emailcache = await redisClient.get(`reset:email:${email}`, "EX", 60 * 60);
  const time_to_live = await redisClient.ttl(`reset:email:${email}`);
  if (emailcache) {
    console.log(`Email can be reseted only after ${time_to_live}`);
    throw new BadRequestError(`Email can be reseted only after ${time_to_live}`);
  }
  console.log("Decoded email:", email);
  if (!email) throw new BadRequestError("Missing email from decoded email token");
  const hashedPassword = await bcrypt.hashSync(newPassword, salt);

  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new BadRequestError("Invalid email");
  }

  await user.update({
    password: hashedPassword,
  });

  await redisClient.set(`reset:email:${email}`, email, "EX", 60 * 60);
  return { email };
};

module.exports = {
  sendResetEmail,
  resetPassword,
  googleAuthCallback,
};
