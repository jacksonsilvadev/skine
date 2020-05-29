class MigrationError extends Error {
  constructor(...args) {
    super(...args);
    Error.captureStackTrace(this, MigrationError);
  }
}

module.exports = MigrationError;
