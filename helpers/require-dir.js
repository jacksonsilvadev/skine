const requireDir = require('require-dir');

module.exports = (path, options) => {
  const defaultOptions = options
    ? { ...options, recurse: true }
    : { recurse: true };

  return requireDir(path, defaultOptions);
};
