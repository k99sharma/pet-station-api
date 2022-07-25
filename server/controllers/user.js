// importing model
const User = require('../models/User');

// importing error handlers
const {
    // sendError,
    sendSuccess
} = require('../utils/errorHelper');

// importing status codes
// const {
//     OK,
//     BAD_REQUEST,
//     NOT_FOUND
// } = require('../utils/statusCodes');


// POST: create a new user
const createUser = async (req, res) => {
    const { 
        firstName, lastName, 
        gender, 
        email, 
        password,
        street, city, state, country, zipCode 
    } = req.body;

    let newUser = new User({
        firstName: firstName.toLowerCase(),
        lastName: lastName.toLowerCase(),
        gender: gender.toLowerCase(),
        email: email.toLowerCase(),
        password: password.toLowerCase(),
        address: {
            street: street.toLowerCase(),
            city: city.toLowerCase(),
            state: state.toLowerCase(),
            country: country.toLowerCase(),
            zipCode: zipCode.toLowerCase()
        }
    });

    await newUser.save();

    return sendSuccess(res, newUser);
}

module.exports = {
    createUser
};