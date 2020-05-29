const authenticationMiddleware = require('./middlewares/authentication');
const httpMiddleware = require('./middlewares/http');

module.exports = {
  middlewares: {
    authentication: authenticationMiddleware,
    http: httpMiddleware,
  },
};
