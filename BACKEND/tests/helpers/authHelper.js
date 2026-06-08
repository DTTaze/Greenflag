const jwt = require("jsonwebtoken");
const path = require("path");

// Load env config just in case
require("dotenv").config({ path: path.resolve(__dirname, "../../.test.env") });

/**
 * Generate a JWT token for a given user ID.
 * @param {number} userId
 * @returns {string}
 */
const generateTestToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_AT_SECRET || "test-secret-at-342444e0-3996-432f-b2b6-a0aaeac19ffc",
    {
      expiresIn: "30m",
    },
  );
};

/**
 * Get the Supertest request headers for authentication.
 * @param {number} userId
 * @returns {object}
 */
const getAuthHeaders = (userId) => {
  const token = generateTestToken(userId);
  return {
    Authorization: `Bearer ${token}`,
  };
};

/**
 * Get the Cookie string for authentication.
 * @param {number} userId
 * @returns {string}
 */
const getAuthCookie = (userId) => {
  const token = generateTestToken(userId);
  return `access_token=${token}`;
};

module.exports = {
  generateTestToken,
  getAuthHeaders,
  getAuthCookie,
};
