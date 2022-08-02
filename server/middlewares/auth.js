// importing modules
const jwt = require('jsonwebtoken');

// importing error helpers
const { sendError } = require('../utils/errorHelper');

// importing status codes
const { NOT_AUTHORIZED } = require('../utils/statusCodes');

// authentication for all users
const allAuth = (req, res, next) => {
    // getting token
    const token = req.header("x-auth-token");

    // if no token found send error
    if(!token)
        return sendError(
            res, 
            "Access Denied. No token provided",
            NOT_AUTHORIZED
        );

    // decoding payload
    const decodePayload = jwt.verify(token, process.env.JWT_PRIVATE_KEY);

    // check if token expired
    const expirationDate = decodePayload.expirationDate;
    const todayDate = new Date();
    if(expirationDate.compareTo(todayDate) < 0)
            return sendError(res, 'Token Expired.', NOT_AUTHORIZED);

    req.user = decodePayload;

    return next();
}

// authentication for admin
const adminAuth = (req, res, next) => {
    // getting token
    const token = req.header("x-auth-token");

    // if no token found send error
    if(!token)
        return sendError(
            res,
            "Access Denied. No token provided",
            NOT_AUTHORIZED
        );

    // decoding payload
    const decodePayload = jwt.verify(token, process.env.JWT_PRIVATE_KEY);

    // check if token expired
    const expirationDate = decodePayload.expirationDate;
    const todayDate = new Date();
    if(expirationDate.compareTo(todayDate) < 0)
            return sendError(res, 'Token Expired.', NOT_AUTHORIZED);

    // checking if user is admin 
    if(decodePayload.admin === 'admin'){
        req.user = decodePayload;
        return next();
    }else{
        return sendError(res, "Forbidden", NOT_AUTHORIZED);
    }
};

module.exports = {
    allAuth,
    adminAuth
}