require('dotenv').config();
const jwt = require('jsonwebtoken');
const jwt_key = process.env.JWT_TOKEN;

/**
 * This application use to generate JWT to be use in requests
 * 
 * 
 * @async
 * @function generate_token
 * @param {Object} payload - The payload to include in the token generation
 * @param {Object} options - Additional JWT options
 * @returns {string} Signed JSON Web Token (JWT) to be use for your operations
 */

const generate_token = async (payload, options) => {

    return jwt.sign(payload, jwt_key, options);
};

module.exports = generate_token;
