// importing libraries
import jsonwebtoken from 'jsonwebtoken';

// importing defined constants
import CONFIG from '../configs/config.js'

// importing error helpers
import { sendError } from '../utilities/errorHelper.js';

// importing status codes
import statusCodes from '../utilities/statusCodes.js';

// redis client
import { getRedisClient } from '../configs/redisConnection.js';

// authentication for all users
export async function allAuth(req, res, next) {
    // getting token
    const token = req.header('x-auth-token')

    // if no token found send error
    if (!token)
        return sendError(
            res,
            statusCodes.NOT_AUTHORIZED,
            'Access Denied. No token provided.',
            'fail'
        );

    // check if token is in cache or not
    const redisClient = getRedisClient();
    const isAvailable = await redisClient.get(token)
    if (isAvailable !== 'true')
        return sendError(
            res,
            statusCodes.NOT_AUTHORIZED,
            'Access Denied. Invalid token.',
            'fail'
        );

    // decoding payload
    let decodedPayload;

    try {
        decodedPayload = jsonwebtoken.verify(token, CONFIG.JWT_PRIVATE_KEY)
    } catch (err) {
        return sendError(res,
            statusCodes.NOT_AUTHORIZED,
            err,
            'fail'
        );
    }

    req.user = decodedPayload;
    return next();
}

// authentication for admin
export async function adminAuth(req, res, next) {
    // getting token
    const token = req.header('x-auth-token')

    // if no token found send error
    if (!token)
        return sendError(
            res,
            statusCodes.NOT_AUTHORIZED,
            'Access Denied. No token provided',
            'fail'
        )

    // check if token is in cache or not
    const redisClient = getRedisClient();
    const isAvailable = await redisClient.get(token);
    if (isAvailable !== 'true')
        return sendError(
            res,
            statusCodes.NOT_AUTHORIZED,
            'Access Denied. Invalid token.',
            'fail'
        );

    // decoding payload
    let decodedPayload;

    try {
        decodedPayload = jsonwebtoken.verify(token, CONFIG.JWT_PRIVATE_KEY);
    } catch (err) {
        return sendError(
            res,
            statusCodes.SERVER_ERROR,
            err,
            'error'
        );
    }

    // check for admin
    if (decodedPayload.role === 'admin') {
        req.user = decodedPayload;
        return next();
    }

    return sendError(
        res,
        statusCodes.NOT_AUTHORIZED,
        'Forbidden.',
        'fail'
    );
}
