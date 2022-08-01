// importing model
const User = require('../models/User');

// importing error handlers
const {
    sendSuccess,
    sendError
} = require('../utils/errorHelper');


// importing status codes
const {
    CONFLICT, NOT_FOUND, BAD_REQUEST, FORBIDDEN
} = require('../utils/statusCodes');


// POST: user login
const userLogin = async (req, res) => {
    // getting request body
    const { email, password } = req.body;

    // check if email is valid
    const user = await User.findOne({ email: email });
    if(!user)
        return sendError(res, 'Invalid email or password', FORBIDDEN);
    
    // check if password is valid 
    const isPasswordValid = user.isValidPassword(password);

    // send error if password is not valid
    if(!isPasswordValid)
        return sendError(res, 'Invalid email or password', FORBIDDEN);

    // if both email and password are valid

    // TODO: code to update login details

    const generatedToken = await user.generateAuthToken();

    return sendSuccess(res, 'Login Successful.', generatedToken);
}

// POST: user logout
const userLogout = async (req, res) => {

}

module.exports = {
    userLogin,
    userLogout
}