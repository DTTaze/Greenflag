const AppError = require("./AppError");

class ConflictError extends AppError {
  constructor(message = "Conflict occurred") {
    super(message, 409);
  }
}

module.exports = ConflictError;
