const cors = require('cors');

module.exports = (config) => {
  if (config.environment === 'development') {
    return cors({ origin: '*' });
  }
  return async (req, res, next) => {
    next();
  };
};
