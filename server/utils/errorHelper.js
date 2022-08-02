// import status codes
const { OK } = require('./statusCodes')

/*
    response object format is
    {
        message: string,
        error: boolean,
        data: json
    }
*/

/**
 * function to send error to error handlers.
 *
 * @param { object, json, number }
 * res is object type, message is json type and status code is number.
 *
 * @return { object }
 * attach json data to res object
 */

module.exports.sendError = (res, message, status) => {
    res.status(status).json({
        message,
        error: true,
        data: null,
    })
}

/**
 * function to send successful response.
 * @param { object, json, number }
 * res is object type, message is json type and status code is number.
 *
 * @return { object }
 * attach json data to res object
 */

module.exports.sendSuccess = (res, data, token) => {
    // if token is present add auth token header
    if (token) {
        return res.status(OK).header('x-auth-token', token).json({
            message: 'success',
            error: false,
            data,
        })
    }

    res.status(OK).json({
        message: 'success',
        error: false,
        data,
    })
}
