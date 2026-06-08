const AppError = require("../errors/AppError");

const errorHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    return res.error(err.statusCode, err.message, err.errors || null);
  }

  // Handle Sequelize validation errors
  if (err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError") {
    const messages = err.errors ? err.errors.map((e) => e.message) : [err.message];
    return res.error(400, "Database validation failed", messages);
  }

  // Log and return unhandled server errors
  console.error("Unhandled Error:", err);
  return res.error(
    500,
    "Internal server error",
    process.env.NODE_ENV === "development" ? err.stack : null,
  );
};

module.exports = errorHandler;
