const rabbitmq = require('./rabbitmq');

module.exports.init = async (options) => {
  if (options.provider === 'rabbitmq') {
    return rabbitmq.init(options);
  }
  return null;
};
