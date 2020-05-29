const applySync = async (options, sequelize) => {
  const sync = await sequelize.sync();

  const seed = options.seed(sequelize.models);

  await seed.down();
  await seed.up();

  return sync;
};

module.exports = async (options, sequelize) => {
  if (options.environment === 'test') {
    return applySync(options, sequelize);
  }

  return [];
};
