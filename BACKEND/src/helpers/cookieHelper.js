const ms = require("ms");

const COOKIE_BASE = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  path: "/",
};

const setAuthCookies = (res, { access_token, refresh_token }) => {
  res.cookie("access_token", access_token, {
    ...COOKIE_BASE,
    maxAge: ms(process.env.JWT_AT_EXPIRE),
  });
  res.cookie("refresh_token", refresh_token, {
    ...COOKIE_BASE,
    maxAge: ms(process.env.JWT_RF_EXPIRE),
  });
};

const clearAuthCookies = (res) => {
  res.clearCookie("access_token", COOKIE_BASE);
  res.clearCookie("refresh_token", COOKIE_BASE);
};

module.exports = {
  setAuthCookies,
  clearAuthCookies,
};
