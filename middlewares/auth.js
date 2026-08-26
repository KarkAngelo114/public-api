/**
* this module allows you to set and check for authentication. This uses
* session-based authentication method
*/

/**
 * middleware to check autheticated user
 */
exports.Authenticate = async (req, res, next) => {
    let session_end_duration  = 1000 * 60 * 60 * 24 * 7;

    // if authData is null, means it's not auntheticated reqeust
    if (!req.session?.authData) {
        return res.status(401).json({ message: 'Unauthenticated' });
    }

    if (Date.now() - req.session.authData.createdAt > session_end_duration) {
        req.session.destroy(() => {});
        return res.status(401).json({message:'Session expired'});
    }

    next();
}

/**
 * sets data after after authentication
 * @param {Object} req - request parameter
 * @param {Object} authData - authentication data to be use
 * @returns 
 */
exports.setAuth = async (req, authData) => {
    let authOptions = {
        userRole: authData.userRole?.toLowerCase() || "user",
        createdAt: Date.now()
    }

    return req.session.authData = {...authOptions, ...authData}
}

/**
 * This is meant to be use on any controllers to access data of the authenticated user (such as IDs, roles, etc.)
 * @param {Object} req - request parameter
 * @returns {Object} Authentication data
 */
exports.getAuthData = async (req) => {
    const req_data = req.session.authData;

    if (!req_data) {
        return {}
    }

    const excludedKeys = ["createdAt"]; // exclude keys that might not be needed
    return Object.fromEntries( 
        Object.entries(req_data).filter(([key]) => !excludedKeys.includes(key)) 
    );
}

// destroy session. User is no longer authenticated anymore
exports.RevokeAuth = (req) => {
    return new Promise((resolve, reject) => {
        req.session.destroy(err => {
            if (err) return reject(err);
            resolve(true);
        });
    });
}