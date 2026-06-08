const AppError = require("./AppError");

class ForbiddenError extends AppError {
  constructor(message = "Forbidden access") {
    super(message, 403);
  }
}

module.exports = ForbiddenError;
