const loggerModule = require('./logger');
const database = require('./database');
const services = require('./services');
const http = require('./http');
const jobs = require('./jobs');
const queue = require('./queue');

const requireDir = require('./helpers/require-dir');

const logger = async (options) => {
  let loggerOptions = options;

  if (loggerOptions.constructor.name === 'Logger') {
    return loggerOptions;
  }

  if (!loggerOptions) {
    loggerOptions = {
      environment: 'development',
      name: 'service',
      level: 'TRACE',
      deployedLevel: 'INFO',
    };
  }

  return loggerModule.create(loggerOptions);
};

const validateConfig = (config) => {
  if (!config.environment) {
    throw new Error('environment property is required at root level.');
  }
};

const getEnvironment = (config) => config.environment;

const getConfigWithEnvironment = (config, defaultEnvironment) => ({
  ...config,
  environment: config.environment ? config.environment : defaultEnvironment,
});

const start = (instances, done) => {
  if (instances.http) {
    instances.http.start(done);
  }
};

const init = async (config) => {
  const instances = {
    logger: null,
    http: null,
    database: null,
    jobs: null,
    services: {},
    queue: {},
  };

  return (async () => {
    validateConfig(config);
    const environment = getEnvironment(config);

    instances.logger = await logger(config.logger);

    if (config.database) {
      instances.database = await database.init({
        ...getConfigWithEnvironment(config.database, environment),
        logger: instances.logger,
      });
    }

    if (config.services) {
      const createdServices = await services.init({
        database: instances.database,
        services: config.services,
        logger: instances.logger,
        queue: instances.queue,
      });

      Object.assign(instances.services, createdServices);
    }

    if (config.queue) {
      const createdQueue = await queue.init({
        ...getConfigWithEnvironment(config.queue, environment),
        logger: instances.logger,
        services: instances.services,
      });

      Object.assign(instances.queue, createdQueue);
    }

    if (config.http) {
      instances.http = await http.init({
        ...getConfigWithEnvironment(config.http, environment),
        logger: instances.logger,
        services: instances.services,
      });
    }

    if (config.jobs) {
      instances.jobs = await jobs.init({
        ...getConfigWithEnvironment({}, environment),
        jobs: config.jobs,
        logger: instances.logger,
        services: instances.services,
      });
    }

    return {
      instances,
      start: (done) => start(instances, done),
    };
  })().catch((err) => {
    if (instances.logger) {
      instances.logger.error(err, 'Unable to start application.');
    } else {
      // eslint-disable-next-line no-console
      console.error('Unable to start application.', err);
    }
  });
};

module.exports = {
  logger,
  init,
  helpers: {
    requireDir,
  },
};
