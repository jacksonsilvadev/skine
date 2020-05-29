const AppError = require('./app-error');

class ValidationError extends AppError {
  constructor(...args) {
    super(...args);
    Error.captureStackTrace(this, ValidationError);
  }
}

module.exports = ValidationError;
