const Umzug = require('umzug');
const Sequelize = require('sequelize');

const MigrationError = require('../errors/migration-error');

const applyMigrations = async (options, sequelize) => {
  try {
    const umzug = new Umzug({
      storage: 'sequelize',
      storageOptions: { sequelize, tableName: 'SequelizeMeta' },
      migrations: {
        params: [sequelize.getQueryInterface(), Sequelize],
        path: options.migrationsPath,
      },
    });

    await umzug.up();
  } catch (err) {
    throw new MigrationError(`Error while applying migrations. ${err}`, err);
  }
};

module.exports = async (options, sequelize) => {
  const { environment, migrationsPath } = options;
  if (environment && environment !== 'test' && migrationsPath) {
    return applyMigrations(options, sequelize);
  }

  return [];
};
