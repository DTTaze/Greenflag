const passport = require("../config/passport");
const oauthService = require("../services/oauthService");
const { setAuthCookies } = require("../helpers/cookieHelper");

const handleGoogleAuth = async (req, res, next) => {
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })(req, res, next);
};

const handleGoogleAuthCallback = async (req, res, next) => {
  passport.authenticate("google", { failureRedirect: "/" }, async (err, user) => {
    if (err) return next(err);
    if (!user) {
      return res.error(401, "Authentication failed");
    }

    try {
      const authResult = await oauthService.googleAuthCallback(user);
      setAuthCookies(res, authResult);
      return res.redirect(`${process.env.FRONTEND_URL}/auth/success`);
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
};

const handleForgotPassword = async (req, res) => {
  const { email } = req.body;
  const sendResetEmail = await oauthService.sendResetEmail(email);
  return res.success("Send successful ", sendResetEmail);
};

const handleResetPassword = async (req, res) => {
  const { newPassword, token } = req.body;
  const email = await oauthService.resetPassword(token, newPassword);
  return res.success("Reset password successful", email);
};

module.exports = {
  handleGoogleAuth,
  handleGoogleAuthCallback,
  handleForgotPassword,
  handleResetPassword,
};
