const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const userService = require("../services/userService");
require("dotenv").config();

// Check if required environment variables are set
const hasGoogleCreds =
  process.env.GOOGLE_CLIENT_ID &&
  process.env.GOOGLE_CLIENT_ID.trim() !== "" &&
  process.env.GOOGLE_CLIENT_SECRET &&
  process.env.GOOGLE_CLIENT_SECRET.trim() !== "" &&
  process.env.GOOGLE_CALLBACK_URL &&
  process.env.GOOGLE_CALLBACK_URL.trim() !== "";

if (!hasGoogleCreds) {
  console.warn("Warning: Missing required Google OAuth environment variables. Google OAuth login will not be available.");
} else {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
        passReqToCallback: true,
      },
      async (req, accessToken, refreshToken, profile, done) => {
        try {
          const user = await userService.findOrCreateUser(profile);
          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      },
    ),
  );
}

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await userService.getUserByID(id);
  done(null, user);
});

module.exports = passport;
