const UnauthorizedError = require('../../../errors/unauthorized-error');
const authProvider = require('../auth');

const getAuthorization = async (req) => {
  let authToken = null;

  if (req.headers && req.headers.authorization) {
    authToken = req.headers.authorization;
  }

  if (req.query && req.query.auth) {
    authToken = req.query.auth;
  }

  if (!authToken) {
    return null;
  }

  return authToken.startsWith('Bearer ')
    ? authToken.split('Bearer ')[1]
    : authToken;
};

module.exports = async (req, res, next) => {
  const authorization = await getAuthorization(req);

  if (authorization) {
    const response = await authProvider.authenticate(authorization);

    if (!response || !response.user) {
      // eslint-disable-next-line no-underscore-dangle
      const message = req.i18n.__('http_error_unauthorized');
      throw new UnauthorizedError(message);
    }

    req.user = response.user;
  }

  next();
};
