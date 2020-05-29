const { conditionalMiddleware } = require('../helpers/middlewares');
const { isClosedRoute } = require('../helpers/routes');
const defaultMiddleware = require('../../providers/default/index');

const getAuthorizationMiddleware = (config) => (config.authProvider
  ? config.authProvider.middlewares.http
  : defaultMiddleware.middlewares.http);

module.exports = (config) => {
  const middleware = getAuthorizationMiddleware(config);
  return conditionalMiddleware(isClosedRoute, middleware);
};
