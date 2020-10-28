const dotenv = require('dotenv');
const path = require('path');
console.log(process.env.NODE_ENV)

const nodeEnv = process.env.NODE_ENV || 'development';
const base = __dirname;

if (['development', 'dev'].includes(nodeEnv)) {
  dotenv.config({
    path: path.resolve(base, '.env.development'),
  });
} else if (['beta', 'staging'].includes(nodeEnv)) {
  dotenv.config({
    path: path.resolve(base, '.env.staging'),
  });
} else if (['prod', 'production'].includes(nodeEnv)) {
  dotenv.config({
    path: path.resolve(base, '.env.production'),
  });
}
console.log(process.env.AUTH_API_HOST)

module.exports = {
  auth: {
    api: process.env.AUTH_API_HOST,
  },
};
