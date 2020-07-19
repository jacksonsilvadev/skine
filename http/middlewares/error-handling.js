const UnauthorizedError = require('../../errors/unauthorized-error');
const ValidationError = require('../../errors/validation-error');
const NotFoundError = require('../../errors/not-found-error');

module.exports = (config) => {
  const isExpressError = (err) => {
    if (!(err instanceof Object) || !err.response) {
      return false;
    }

    const keys = Object.keys(err.response);
    return keys.includes('status');
  };

  // eslint-disable-next-line no-unused-vars
  return async (err, req, res, next) => {
    let status = 500;
    // eslint-disable-next-line no-underscore-dangle
    let { message } = err;

    if (err instanceof UnauthorizedError) {
      status = 401;
      message = err.message;
    } else if (err instanceof ValidationError) {
      status = 400;
      message = err.message;
    } else if (err instanceof NotFoundError) {
      status = 404;
      message = err.message;
    } else if (isExpressError(err)) {
      status = err.response.status;
    }

    if (config.environment !== 'test') {
      config.logger.error(err);
    }

    res.status(status).send({
      message,
    });
  };
};
