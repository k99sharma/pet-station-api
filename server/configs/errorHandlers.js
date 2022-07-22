// import error helper functions
const { sendError } = require('../utilities/errorHelper');

// import status codes
const {
    NOT_FOUND,
    SERVER_ERROR
} = require('../utilities/statusCodes');


/**
 * function to catch errors in middleware functions.
 * 
 * @params { function }
 * 
 * @return { function }
 */

module.exports.catchErrors = (middleware) => {
    return async (req, res, next) => {
        try{
            await middleware(req, res, next);
        }catch(err){
            next(err);
        }
    }
};

/**
 * function to handle not found routes.
 * 
 * @params { object, object }
 * 
 * @return { function }
 */

module.exports.notFound = (req, res) => {
    return sendError(res, "Route doesn't exist.", NOT_FOUND);
}

/**
 * custom error handler
 * 
 * @params { object, object, object, object } 
 * 
 * @return { function }
 */

module.exports.sendErrors = (err, res) => {
    // logging errors to console
    console.error(err);

    // return error
    return sendError(res, 'Something went wrong!', err.status || SERVER_ERROR);
}