const axios = require('axios').default;

const config = require('../../../config');

const AUTH_API_HOST = `${config.auth.api}`;

const authenticate = async (authToken) => {
  if (!authToken) {
    return null;
  }

  const result = await axios.post(`${AUTH_API_HOST}validate-user`, {
    authToken,
  });

  return result.data;
};

module.exports = {
  authenticate,
};
