// importing model
const User = require('../models/User');

// importing error handlers
const {
    sendSuccess, 
    sendError
} = require('../utils/errorHelper');


// importing status codes
const {
    CONFLICT
} = require('../utils/statusCodes');


// POST: create a new user
const createUser = async (req, res) => {
    const { 
        firstName, lastName, 
        gender, 
        email, 
        password,
        street, city, state, country, zipCode 
    } = req.body;

    // if user exists do not create new user
    let user = await User.findOne({
        email: email
    });
    
    if(user)
        return sendError(res, 'User already exists.', CONFLICT);

    // creating new user model
    const newUser = new User({
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

    // save user in database
    await newUser.save();

    return sendSuccess(res, 'User successfully created.');
}

module.exports = {
    createUser
};