const axios = require('axios').default;
const UnauthorizedError = require('../../../errors/unauthorized-error');


const config = require('../../../config');

const AUTH_API_HOST = `${config.auth.api}`;

const authenticate = async (authToken) => {
  try {
    if (!authToken) {
      return null;
    }
  
    const result = await axios.post(`${AUTH_API_HOST}validate-user`, {
      authToken,
    });
    
    return result.data;
  } catch (error) {
    const message = error.response ? error.response.data.message: ""
    
    if(message === 'jwt expired'){
      throw new UnauthorizedError(message)
    }

    return error
  }
 
};

module.exports = {
  authenticate,
};
