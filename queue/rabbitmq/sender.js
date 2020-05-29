const connector = require('./connector');
const logger = require('../../logger');

const getLogger = (options) => (options.logger ? options.logger : logger);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const onConnectionClose = (options) => {
  const log = getLogger(options);
  log.trace(options.processName, 'Connection closed.');
};

const bool = (opt, defaultValue) => {
  if (opt === true || opt === false) {
    return opt;
  }

  return defaultValue;
};

const send = async (options = {}, destination, msg, environment) => {
  options.processName = options.processName || 'Queue Sender';
  options.durable = bool(options.durable, true);
  options.persistent = bool(options.persistent, true);

  const connection = await connector.createConnection(options, () => onConnectionClose(options));
  try {
    const channel = await connector.createChannel(connection, options);
    await connector.assertQueue(connection, channel, options, environment);

    const messageToSend = JSON.stringify(msg);
    await channel.sendToQueue(destination, Buffer.from(messageToSend), {
      persistent: options.persistent,
    });

    await sleep(options.sleep || 500);
    connection.close();

    return true;
  } catch (err) {
    connector.onError(err, options);
    return false;
  }
};

module.exports = { send };
