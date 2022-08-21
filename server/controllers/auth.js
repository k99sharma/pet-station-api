// importing model
const User = require('../models/User')
const LoginDetail = require('../models/LoginDetail')

// importing error handlers
const { sendSuccess, sendError } = require('../utils/errorHelper')

// creating redis client
const { getClient } = require('../configs/redisConnection')
const client = getClient()

// importing status codes
const { SERVER_ERROR, FORBIDDEN, CONFLICT } = require('../utils/statusCodes')

// importing services
const { emailService } = require('../services/email');

// POST: user signup
const userSignup = async (req, res) => {
    const {
        firstName,
        lastName,
        gender,
        email,
        password,
        street,
        region,
        country,
        postalZip,
    } = req.body

    // if user exists do not create new user
    let user = await User.findOne({
        email: email,
    })

    if (user) return sendError(res, 'User already exists.', CONFLICT)

    // creating new user model
    const newUser = new User({
        firstName: firstName.toLowerCase(),
        lastName: lastName.toLowerCase(),
        gender: gender.toLowerCase(),
        email: email,
        password: password.toLowerCase(),
        address: {
            street: street.toLowerCase(),
            region: region.toLowerCase(),
            country: country.toLowerCase(),
            postalZip: postalZip.toLowerCase(),
        },
    })

    // save user in database
    await newUser.save()

    // send email to client
    // TODO: this email is supposed to be confirmation email
    const data = {
        name: {
            firstName: newUser.firstName,
            lastName: newUser.lastName
        },
        email: newUser.email
    }

    const serviceResponse = await emailService('signup', data);

    if (serviceResponse.error) {
        // TODO: Need to handle unsent emails
        console.log('Email cannot be sent!');
    } else {
        console.log(serviceResponse.msg);
    }


    return sendSuccess(res, 'User successfully created.')
}

// POST: user login
const userLogin = async (req, res) => {
    // getting request body
    const { email, password, clientMachineInformation } = req.body

    // check if email is valid
    const user = await User.findOne({ email: email })
    if (!user) return sendError(res, 'Invalid email or password', FORBIDDEN)

    // checking if user have login record
    let loginRecord = await LoginDetail.findOne({ userId: user.userId })

    // check if password is valid
    const isPasswordValid = await user.isValidPassword(password)

    // send error if password is not valid
    if (!isPasswordValid) {
        // update failed login record
        if (loginRecord) {
            const lastFailedCount = parseInt(loginRecord.lastFailedCount) + 1
            console.log(lastFailedCount)

            loginRecord = await LoginDetail.findOneAndUpdate(
                { userId: user.userId },
                {
                    lastFailedCount: lastFailedCount,
                    lastFailedLogin: new Date(),
                }
            )
        }
        return sendError(res, 'Invalid email or password', FORBIDDEN)
    }

    // if both email and password are valid
    /*
        Update login details of user
    */

    // check if user record exists or its first time login
    if (!loginRecord) {
        // creating new record
        loginRecord = new LoginDetail({
            userId: user.userId,
            clientMachineInformation: clientMachineInformation,
        })

        // save login record
        await loginRecord.save()

        // save this record information in user record
        await User.findOneAndUpdate(
            { userId: user.userId },
            { loginDetails: loginRecord._id }
        )

        console.log('Login record saved!')
    }

    // updating last login
    loginRecord = await LoginDetail.findOneAndUpdate(
        { userId: user.userId },
        {
            lastLogin: new Date(),
            lastFailedCount: 0,
        }
    )

    // generate auth token
    // send successful login message and token as header

    const generatedToken = await user.generateAuthToken()

    // adding value in redis cache
    await client.set(generatedToken, 'true')
    client.expire(generatedToken, 60 * 60 * 24 * 7) // setting token expiration

    // send email to client
    const data = {
        name: {
            firstName: user.firstName,
            lastName: user.lastName
        },
        email: user.email
    }

    const serviceResponse = await emailService('login', data);

    if (serviceResponse.error) {
        // TODO: Need to handle unsent emails
        console.log('Email cannot be sent!');
    } else {
        console.log(serviceResponse.msg);
    }

    return sendSuccess(res, 'Login Successful.', generatedToken)
}

// GET: token extend i.e send new token
const extendToken = async (req, res) => {
    const userId = req.user.userId

    // get user
    const user = await User.findOne({ userId: userId })

    // generate new token
    const generatedToken = await user.generateAuthToken()

    // adding value in redis cache
    await client.set(generatedToken, 'true')
    client.expire(generatedToken, 60 * 60 * 24 * 7) // setting token expiration

    return sendSuccess(res, 'Token extended.', generatedToken)
}

// POST: user logout
const userLogout = async (req, res) => {
    const token = req.params.token

    // delete token from redis
    await client.del(token, (err, res) => {
        if (err) {
            console.log(err)
            return sendError(res, 'Logout failed!', SERVER_ERROR)
        }
    })

    return sendSuccess(res, 'Logout successful.')
}

module.exports = {
    userSignup,
    userLogin,
    userLogout,
    extendToken,
}
