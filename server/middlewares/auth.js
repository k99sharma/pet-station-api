// importing modules
const jwt = require('jsonwebtoken');

// importing defined constants
const { JWT_PRIVATE_KEY } = require('../configs/index');

// importing error helpers
const { sendError } = require('../utils/errorHelper');

// importing status codes
const { NOT_AUTHORIZED } = require('../utils/statusCodes');

// redis client
const { getClient } = require('../configs/redisConnection');
const client = getClient();

// authentication for all users
const allAuth = async (req, res, next) => {
    // getting token
    const token = req.header("x-auth-token");

    // if no token found send error
    if (!token)
        return sendError(
            res,
            "Access Denied. No token provided.",
            NOT_AUTHORIZED
        );

    // check if token is in cache or not
    const isAvailable = await client.get(token);
    if (isAvailable !== 'true')
        return sendError(res, 'Access Denied. Invalid token.', NOT_AUTHORIZED);

    // decoding payload
    let decodedPayload;

    try {
        decodedPayload = jwt.verify(token, JWT_PRIVATE_KEY)
    }
    catch (err) {
        return sendError(res, err, NOT_AUTHORIZED)
    }

    req.user = decodedPayload;
    return next();
}

// authentication for admin
const adminAuth = async (req, res, next) => {
    // getting token
    const token = req.header("x-auth-token");

    // if no token found send error
    if (!token)
        return sendError(
            res,
            "Access Denied. No token provided",
            NOT_AUTHORIZED
        );


    // check if token is in cache or not
    const isAvailable = await client.get(token);
    if (isAvailable !== 'true')
        return sendError(res, 'Access Denied. Invalid token.', NOT_AUTHORIZED);

    // decoding payload
    let decodedPayload;

    try {
        decodedPayload = jwt.verify(token, JWT_PRIVATE_KEY);
    }
    catch (err) {
        return sendError(res, err, NOT_AUTHORIZED);
    }

    // check for admin
    if (decodedPayload.role === 'admin') {
        req.user = decodedPayload;
        return next();
    }

    return sendError(res, 'Forbidden', NOT_AUTHORIZED);
};

module.exports = {
    allAuth,
    adminAuth
}