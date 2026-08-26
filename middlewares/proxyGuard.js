require('dotenv').config();
const crypto = require('crypto');


/**
 * 
 * Decodes the hashed signature included in the request and compares it the expected signature
 *
 * 
 * 
 */
const decodeHashedSignature= (req, res, next) => {

    const timeStamp = req.headers['request-timestamp'];
    const signature = req.headers['request-signature'];
    const proxy_secret_key = process.env.PROXY_SECRET_KEY;

    if (!proxy_secret_key) {
        console.log("[INFO]------- No proxy secret key provided. Bypassing this middleware... For security, please provide proxy secret key and ensure that the request origin uses the same secret key");
        next();
    }

    if (!timeStamp || !signature) {
        return res.status(403).json({"message":"[403 - FORBIDDEN]------- Request denied. Neither 'request-timestamp' nor 'request-signature' is present in the request"});
    }

    const dateNow = new Date();
    if (Math.abs(dateNow - parseInt(timeStamp)) > 1000 * 60 * 5) {
        return res.status(403).json({"message":"[403 - FORBIDDEN]------- Request denied. Timestamp expired"});
    }

    const expectedSignature = crypto.createHmac('sha256', proxy_secret_key).update(timeStamp).digest('hex');

    if (signature !== expectedSignature) {
        return res.status(403).json({"message":"[403 - FORBIDDEN]------- Request denied. Signatures did not match"});
    }

    next();
}


module.exports = {
    decodeHashedSignature
};