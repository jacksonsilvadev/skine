const AppError = require('./app-error');

class UnauthorizedError extends AppError {
  constructor(...args) {
    super(...args);
    Error.captureStackTrace(this, UnauthorizedError);
  }
}

module.exports = UnauthorizedError;
