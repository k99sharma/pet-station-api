/*
    An HTTP status code is a message a website's server sends 
    to the browser to indicate whether or not that 
    request can be fulfilled.
*/

module.exports = {
    OK: 200,
    BAD_REQUEST: 400,
    NOT_AUTHORIZED: 401,
    FORBIDDEN: 403, 
    NOT_FOUND: 404,
    NOT_ACCEPTABLE: 406,
    CONFLICT: 409,
    SERVER_ERROR: 500,
};