import { defineAbilitiesFor } from "../utils/ability.js";

const checkPermission = (action, subject) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.error(401, "Unauthorized: User not found in request");
      }
      const ability = await defineAbilitiesFor(req.user);
      if (!ability) {
        return res.error(500, "Internal Server Error: Failed to define user abilities");
      }
      if (ability.can(action, subject)) {
        return next();
      } else {
        return res.error(403, "Forbidden: You do not have permission to access this resource");
      }
    } catch (error) {
      return res.error(
        500,
        "Internal Server Error: Failed to check user permission",
        error.message,
      );
    }
  };
};

module.exports = checkPermission;
