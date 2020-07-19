const consumer = require('./consumer');
const sender = require('./sender');
const { onConsume } = require('./callbacks');

module.exports.init = async (options) => {
  const queueOptions = {
    host: options.host,
    config: options.args,
    queueName: options.queue,
    processName: options.process,
    durable: true,
    autoDelete: false,
    logger: options.logger,
  };

  const env = options.environment === 'production'
    ? 'prod' : options.environment;

  const operations = options.operations ? options.operations({
    services: options.services,
  }) : [];

  consumer.start(queueOptions, onConsume(operations), env);

  return {
    send: async (destination, request) => sender.send(queueOptions, destination, request, env),
  };
};
