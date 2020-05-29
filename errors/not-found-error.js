const AppError = require('./app-error');

class NotFoundError extends AppError {
  constructor(...args) {
    super(...args);
    Error.captureStackTrace(this, NotFoundError);
  }
}

module.exports = NotFoundError;
