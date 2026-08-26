require('dotenv').config();
const session = require('express-session');

const createSession = session({
    secret: process.env.SESSION_SECRET || 'api_key_123', // Note: use your own API key. This is one just sample. Encode your API key on your .env file 
    resave: false,
    saveUninitialized: true,
    rolling: true,
    cookie: {
        secure:false,
        maxAge: 1000 * 60 * 60 * 7, // default is 7 days
        sameSite: process.env.ENVIRONMENT === "local" ? 'lax' :"none" 
    }
});

module.exports = createSession;