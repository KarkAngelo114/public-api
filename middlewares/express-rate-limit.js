// This is your rate limiting middleware.
// You can modify this to suits your needs.

const rateLimit = require('express-rate-limit');

const rate_limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: "Too many requests. . ."
});

module.exports = rate_limiter;