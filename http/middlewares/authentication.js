const { conditionalMiddleware } = require('../helpers/middlewares');
const { isClosedRoute } = require('../helpers/routes');
const defaultMiddleware = require('../../providers/default/index');

const getAuthenticationMiddleware = (config) => (config.authProvider
  ? config.authProvider.middlewares.authentication
  : defaultMiddleware.middlewares.authentication);

module.exports = (config) => {
  const middleware = getAuthenticationMiddleware(config);
  return conditionalMiddleware(isClosedRoute, middleware);
};
