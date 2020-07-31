const amqp = require('amqplib');
const logger = require('../../logger');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const isIgnoredError = (err) => err.message === 'Connection closing';
const getLogger = (options) => (options.logger ? options.logger : logger);

const onError = (err, options) => {
  const log = getLogger(options);
  log.error(err);
};

const onConnectionError = (err, options) => {
  if (!isIgnoredError(err)) {
    const log = getLogger(options);
    log.error(err);
  }
};

const onChannelError = (err, options) => {
  const log = getLogger(options);
  log.error(err);
};

const onChannelClose = (options) => {
  const log = getLogger(options);
  log.trace(options.processName, 'Channel closed.');
};

const createConnection = async (options, onConnectionClose, reconnect) => {
  try {
    const connection = await amqp.connect(`${options.host}?${options.config}`);
    connection.on('error', (err) => onConnectionError(err, options));
    connection.on('close', onConnectionClose || (() => {}));

    const log = getLogger(options);
    log.trace(options.processName, 'Queue connection established.');

    return connection;
  } catch (err) {
    onError(err, options);
    if (reconnect) {
      await sleep(options.sleep || 1000);
      return createConnection(options);
    }
    return null;
  }
};

const createChannel = async (connection, options) => {
  try {
    const ch = await connection.createChannel();

    ch.on('error', (err) => onChannelError(err, options));
    ch.on('close', () => onChannelClose(options));
    ch.prefetch(10);

    return ch;
  } catch (err) {
    onError(err, options);
    connection.close();
    return false;
  }
};

const assertQueue = async (connection, channel, options, environment) => {
  try {
    const deadletterExchange = environment === 'prod'
      ? 'profiz.deadletter.fanout'
      : 'profiz.deadletter.dev.fanout';
    await channel.assertQueue(options.queueName, {
      autoDelete: options.autoDelete || false,
      durable: options.durable || false,
      arguments: {
        'x-message-ttl': options.messageTtl || 180000, // 3 min
        'x-dead-letter-exchange': deadletterExchange,
        'x-queue-mode': options.queueMode || 'default', // lazy or default
      },
    });
  } catch (err) {
    onError(err, options);
    connection.close();
  }
};

module.exports = {
  createConnection, createChannel, assertQueue, onError,
};
