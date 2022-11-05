// importing model
const User = require('../models/User')

// importing error handlers
const { sendSuccess, sendError } = require('../utils/errorHelper')

// creating redis client
const { getClient } = require('../configs/redisConnection')
const client = getClient()

// importing status codes
const { SERVER_ERROR, FORBIDDEN, CONFLICT } = require('../utils/statusCodes')

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

    return sendSuccess(res, 'User successfully created.')
}

// POST: user login
const userLogin = async (req, res) => {
    // getting request body
    const { email, password } = req.body

    // check if email is valid
    const user = await User.findOne({ email: email })
    if (!user) return sendError(res, 'Invalid email or password', FORBIDDEN)

    // check if password is valid
    const isPasswordValid = await user.isValidPassword(password)

    // send error if password is not valid
    if (!isPasswordValid) {
        return sendError(res, 'Invalid email or password', FORBIDDEN)
    }

    // generate auth token
    // send successful login message and token as header
    const generatedToken = await user.generateAuthToken()

    // adding value in redis cache
    await client.set(generatedToken, 'true')
    client.expire(generatedToken, 60 * 60 * 24 * 7) // setting token expiration

    return sendSuccess(res, {
        msg: 'Login Successful.',
        token: generatedToken
    })
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

    return sendSuccess(res, {
        msg: 'Token extended',
        token: generatedToken
    })
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
