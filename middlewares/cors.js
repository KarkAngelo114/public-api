require('dotenv').config();
const cors = require('cors');

/**
 * All origins are allowed to this applied route
 */
exports.publicCors = cors({origin:"*"});

/**
 * Whitelisted origins are the only ones allowed to the applied route
 */
exports.allowedCors = cors({
    origin: (origin, callback) => {
        const allowedOrigins = [
            process.env.CLIENT_APP_URL,
            /* more origins */
        ];

        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    // credentials:true, /** uncomment this if you're working with cookies/session-based tokens */
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', /* add more methods */],
    allowedHeaders: ['Content-Type', 'Authorization', /* add more allowed headers */],
});
