const bunyan = require('bunyan');

module.exports.create = async (config) => bunyan.createLogger({
  name: config.name,
  level: config.level,
  deployedLevel: config.deployedLevel,
  environment: config.environment,
});
