const express = require('express');

const i18n = require('./middlewares/i18n');
const cors = require('./middlewares/cors');
const router = require('./middlewares/router');
const bodyLimit = require('./middlewares/body-limit');
const compression = require('./middlewares/compression');
const errorHandler = require('./middlewares/error-handling');
const authentication = require('./middlewares/authentication');

const defaultMiddleware = require('../providers/default/index');

function readConfig(config) {
  return {
    ...config,
    environment: config ? config.environment || 'development' : 'development',
    port: config ? config.port || 3000 : 3000,
    name: config ? config.name || 'Hello World' : 'Hello World',
  };
}

function validateAuthProvider(config) {
  const { authProvider } = config;
  const middlewares = authProvider ? authProvider.middlewares : defaultMiddleware;

  const noMiddlewares = !middlewares || Object.keys(middlewares).length === 0;

  if (noMiddlewares) {
    throw new Error(
      'Auth Provider should implement middlewares for HTTP servers.',
    );
  }
}

module.exports.init = async (options) => {
  const app = express();
  const config = readConfig(options);

  validateAuthProvider(config);

  app.set('port', config.port);

  app.use(compression(config));
  app.use(i18n(config));
  app.use(cors(config));
  app.use(bodyLimit(config));
  app.use(authentication(config));
  app.use(router(config));
  app.use(errorHandler(config));

  const holder = {
    server: null,
  };

  return {
    start: (callback) => {
      holder.server = app.listen(config.port, callback);

      options.logger.info(
        `🚀 Application ${config.name} ready to rock in port ${config.port}!`,
      );
    },
    stop: (callback) => {
      if (holder.server) {
        holder.server.close();

        if (callback) {
          callback();
        }

        options.logger.info(`Application ${config.name} stopped.`);
      }
    },
    getInstance: () => holder.server,
    getApp: () => app,
  };
};
