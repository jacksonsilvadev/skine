const sequelize = require('./sequelize');

module.exports.init = async (options) => {
  if (!options.provider || options.provider === 'sequelize') {
    return sequelize(options);
  }
  return null;
};
