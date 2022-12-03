// Response format is taken from JSend format.
/*
    JSend different types of responses.

    Type --> Description --> Required Keys --> Optional Keys

    success --> All went well. --> status, data
    fail --> There is a problem the data not submitted or some pre-condition is failed --> status, data
    error --> An error occurred in processing request --> status, message --> code, data
*/

// function to send error
export function sendError(res, statusCode, message, status) {
    res.status(statusCode).json({
        status,
        message,
        code: statusCode,
        data: null
    });
}

// function to send success
export function sendSuccess(res, statusCode, data, status) {
    res.status(statusCode).json({
        status,
        data
    });
}