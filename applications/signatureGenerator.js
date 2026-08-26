


const crypto = require('crypto');

/**
 * 
 * This application is use for generating hashed signatures which can be include in your request when communicating server to server.
 * Server applications that are built using ExpressiveJS can use the proxyGuard middleware to decode the hashed signature and make request
 * @function generateSignedSignature
 * @param {any} proxy_secret_key - use to hash and signed the signature. The proxy secret key is the key to commumicate server to server and will be use to decode the hash signature. Ensure the the secret key is the same key of the server you are communicating.
 * @returns {object} timestamp and signature
 * @example
 * // example usage:
 * const generateSignedSignature = require('../applications/signatureGenerator');
 * const {timeStamp, signature} = generateSignedSignature(your_secret_key);
 *
 */
const generateSignedSignature = (proxy_secret_key) => {
    try {
        

        if (!proxy_secret_key || proxy_secret_key === '') {
            throw new Error("[ERROR]------- Failed to generate signature. No proxy secret key provided");
        }

        
        const timeStamp = Date.now().toString(); // Use milliseconds for consistency
        const signature = crypto.createHmac('sha256', proxy_secret_key).update(timeStamp).digest('hex');
        return { timeStamp, signature };
    }
    catch (error) {
        console.error(error.message);
    }
    
};

module.exports = generateSignedSignature;