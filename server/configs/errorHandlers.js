// importing error helper
import { sendError } from '../utilities/errorHelper.js';

// importing status codes
import statusCodes from '../utilities/statusCodes.js';

// function to catch errors in middleware
export function catchErrors(middleware) {
    return async (req, res, next) => {
        try {
            await middleware(req, res, next);
        } catch (err) {
            next(err);
        }
    }
}

// function to handle not found
export function notFound(req, res) {
    return sendError(
        res,
        statusCodes.NOT_FOUND,
        'Route not found!',
        'error',
        statusCodes.NOT_FOUND
    )
}

// function to send error
export function sendErrors(err, res) {
    console.error(err);

    return sendError(res, 'Something went wrong!', err.status || statusCodes.SERVER_ERROR);
}