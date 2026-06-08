const express = require("express");
const oauthController = require("../controllers/oauthController");
const userController = require("../controllers/userController");
const rateLimit = require("../middlewares/rateLimit");
const validate = require("../middlewares/validate");
const {
  registerUserDto,
  loginUserDto,
  forgotPasswordDto,
  resetPasswordDto,
} = require("../dtos/authDto");

const router = express.Router();

router.post("/register", validate(registerUserDto), userController.handleCreateUser);
router.post(
  "/login",
  rateLimit.loginLimiterByEmail,
  validate(loginUserDto),
  userController.handleLoginUser,
);
router.post("/logout", userController.handleLogoutUser);
router.post("/refresh_token", userController.handleRefreshAccessToken);

router.get("/login/google", oauthController.handleGoogleAuth);
router.get("/login/google/callback", oauthController.handleGoogleAuthCallback);
router.post("/forgot_password", validate(forgotPasswordDto), oauthController.handleForgotPassword);
router.post("/reset_password", validate(resetPasswordDto), oauthController.handleResetPassword);

module.exports = router;
