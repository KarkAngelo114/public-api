// This is your middleware that checks for the headers included in the request sent from the client side.
// Feel free to modify this file to suits your needs.

require('dotenv').config();

const checkHeaders = async (req, res, next)  => {

    const headers = "ThisIsAHeaderIncludedInTheRequestAndExpectedToMatchtoWhatIsSent"; // better store this in your .env
    const header_name = "Sample-header-name";
    const client_header = req.headers[header_name];

    if (!client_header) {
        return res.status(403).json({"message":"FORBIDDEN"});
    }

    if (client_header === headers) {
        next();
    }
    else {
        return res.status(403).json({"message":"FORBIDDEN"});
    }

};

module.exports = {
    checkHeaders
};