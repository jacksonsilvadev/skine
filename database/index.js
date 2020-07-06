const sequelize = require('./sequelize');
const prisma = require('./prisma');

module.exports.init = async (options) => {
  if (!options.provider || options.provider === 'sequelize') {
    return sequelize(options);
  } if (options.provider === 'prisma') {
    return prisma(options);
  }
  return null;
};
