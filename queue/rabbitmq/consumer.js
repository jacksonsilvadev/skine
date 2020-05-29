const connector = require('./connector');
const logger = require('../../logger');

const getLogger = (options) => (options.logger ? options.logger : logger);

const setConsumer = async (channel, options) => {
  try {
    const consumeOptions = {
      noAck: false,
    };

    const consumer = async (msg) => {
      try {
        const parsedMsg = JSON.parse(msg.content.toString('utf8'));
        const ok = await options.onConsume(parsedMsg);

        if (ok) {
          channel.ack(msg);
        } else {
          channel.reject(msg, true);
        }
      } catch (err) {
        connector.onError(err, options);
        channel.reject(msg, true);
      }
    };

    channel.consume(options.queueName, consumer, consumeOptions);
  } catch (err) {
    connector.onError(err, options);
  }
};

const start = async (options = {}, onConsume, environment) => {
  options.onConsume = onConsume;
  options.processName = options.processName || 'Queue Consumer';

  const connection = await connector.createConnection(
    options,
    () => {
      const log = getLogger(options);
      log.trace(options.processName, 'Reconnecting');
      setTimeout(() => start(options, onConsume), 5000);
    },
    true,
  );

  try {
    const channel = await connector.createChannel(connection, options);
    await connector.assertQueue(connection, channel, options, environment);
    await setConsumer(channel, options);

    const log = getLogger(options);
    log.trace(options.processName, 'Worker started.');
  } catch (err) {
    connector.onError(err, options);
    connection.close();
  }
};

module.exports = { start };
