const Sequelize = require('sequelize');

const TIME_ZONE = '-03:00';

const isTestEnvironment = (config) => config.environment === 'test';

const resolveDialect = (config) => (isTestEnvironment(config) || config.dialect === 'sqlite'
  ? 'sqlite'
  : 'mysql');

const logging = (config) => (query, executionTime) => {
  config.logger.trace(`[${executionTime} ms] ${query}`);
};

const validateConfigByNames = (config, names) => {
  names.forEach((key) => {
    if (!config[key]) {
      throw new Error(`Unable to connect to database: missing ${key} config.`);
    }
  });
};

const validateConfig = (config, dialect) => {
  if (!config.environment) {
    throw new Error(
      'Unable to start database connection: environment is missing.',
    );
  }

  if (dialect === 'mysql') {
    validateConfigByNames(config, ['host', 'name', 'user', 'password']);
  } else if (dialect === 'sqlite') {
    validateConfigByNames(config, ['location']);
  }

  if (config.environment === 'test') {
    validateConfigByNames(config, ['seed']);
  }
};

const buildSequelizeOptions = (config) => {
  const dialect = resolveDialect(config);

  validateConfig(config, dialect);

  const options = {
    host: config.host,
    dialect,
    dialectOptions: {
      timezone: TIME_ZONE,
      typeCast: true,
    },
    benchmark: true,
    define: {
      paranoid: true,
      underscored: true,
    },
    logging: logging(config),
    operatorsAliases: '0',
  };

  if (dialect === 'sqlite') {
    options.storage = config.location;
  } else {
    options.timezone = TIME_ZONE;
  }

  return options;
};

module.exports = (config) => {
  validateConfig(config);

  return new Sequelize(
    config.name,
    config.user,
    config.password,
    buildSequelizeOptions(config),
  );
};
