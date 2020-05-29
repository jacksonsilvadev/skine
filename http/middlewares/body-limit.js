const bodyParser = require('body-parser');

module.exports = (config) => {
  const limit = config.bodyLimit || '1mb';

  return [
    bodyParser.json({ limit, extended: true }),
    bodyParser.urlencoded({ limit, extended: true }),
  ];
};
