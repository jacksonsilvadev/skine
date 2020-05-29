class AppError extends Error {
  constructor(...args) {
    super(...args);
    Error.captureStackTrace(this, AppError);
  }
}

module.exports = AppError;
