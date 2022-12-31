// controllers for auth routes

// importing libraries
import bcryptjs from 'bcryptjs';

// importing schemas
import User from '../schemas/User.js';
import Username from '../schemas/Username.js';
import Friend from '../schemas/Friend.js';

// importing status codes
import statusCodes from '../utilities/statusCodes.js';

// importing error handlers
import { sendSuccess, sendError } from '../utilities/errorHelper.js';

// import redis client
import { getRedisClient } from '../configs/redisConnection.js';

// importing helpers
import { generateDefaultUsername } from '../utilities/helper.js';

// signup controller
export async function signup(req, res) {
    const {
        firstName,
        lastName,
        email,
        gender,
        password
    } = req.body;

    // if user already exists
    const isAvailable = await User.findOne({ email });
    if (isAvailable)
        return sendError(
            res,
            statusCodes.CONFLICT,
            'Email is already in use.',
            'fail'
        );

    // create new user instance
    const newUser = new User({
        firstName,
        lastName,
        email,
        gender,
        password
    });

    // saving user instance
    newUser.save()
        .then(data => {
            console.log(data);
            console.log('User is saved.');

            // setting up default username for the user
            const newDefaultUsername = generateDefaultUsername(data.firstName);   // generating new username
            const username = new Username({
                UID: data.UID,
                username: newDefaultUsername
            });

            username.save()
                .then(() => {
                    console.log('Default username is set.');
                })
                .catch((err) => {
                    console.error(err);
                    console.log('Username cannot be set.');
                })

            const friends = new Friend({
                UID: data.UID
            });

            friends.save()
            .then(()=>{
                console.log('Friend array is added.')
            })
            .catch(err => {
                console.error(err);
            })
        })
        .catch(err => {
            console.log('User cannot be saved.')
            console.error(err);

            return sendError(
                res,
                statusCodes.SERVER_ERROR,
                'Request cannot be processed by database.',
                'error'
            );
        })

    // signup is successful
    return sendSuccess(
        res,
        statusCodes.OK,
        'Signup is successful.',
        'success'
    );
}

// login controller
export async function login(req, res) {
    const { email, password } = req.body;

    // check if email exists
    const user = await User.findOne({ email });
    if (!user)
        return sendError(
            res,
            statusCodes.FORBIDDEN,
            'Email or password is invalid.',
            'fail'
        );

    // check if password is valid
    user.isValidPassword(password)
        .then(() => {
            console.log('Password is valid.');

            // generate auth token
            // send this token in response
            const generatedToken = user.generateAuthToken();

            // add value in redis cache
            const redisClient = getRedisClient();
            redisClient.set(generatedToken, 'true')
                .then(() => {
                    console.log('Redis token is set');
                    redisClient.expire(generatedToken, 60 * 60 * 24 * 7);     // token expiration
                })
                .catch(err => {
                    console.error(err);
                })

            return sendSuccess(
                res,
                statusCodes.OK,
                {
                    msg: 'Login is successful.',
                    token: generatedToken
                },
                'success'
            );
        })
        .catch(err => {
            console.log('Password is not valid.');
            console.error(err);

            return sendError(
                res,
                statusCodes.FORBIDDEN,
                'Email or password is invalid.',
                'fail'
            );
        })

    return null;
}


// reset password controller
export async function resetPassword(req, res) {
    const { userId, password } = req.body;

    // generating password hash
    const salt = await bcryptjs.genSalt(10);
    const hash = await bcryptjs.hash(password, salt);

    // updating user password
    User.findOneAndUpdate({ UID: userId }, {
        password: hash
    })
        .then(() => {
            console.log('Password is updated.')
        })
        .catch(err => {
            console.error(err);
            return sendError(
                res,
                statusCodes.SERVER_ERROR,
                'Password cannot be reset.',
                'error'
            );
        })


    return sendSuccess(
        res,
        statusCodes.OK,
        'Password successfully reset.',
        'success'
    );
}

// extend token controller
export async function extendToken(req, res) {
    const { userId } = req.user;

    // user document
    const user = await User.findOne({ UID: userId });

    // generate new token
    const generatedToken = await user.generateAuthToken()

    // adding value in redis cache
    const redisClient = getRedisClient();
    await redisClient.set(generatedToken, 'true')
    redisClient.expire(generatedToken, 60 * 60 * 24 * 7) // setting token expiration

    return sendSuccess(
        res,
        statusCodes.OK,
        {
            msg: 'Token is extended.',
            token: generatedToken
        },
        'success'
    )
}

// logout controller
export async function logout(req, res) {
    const { token } = req.params;

    // delete token from redis
    const redisClient = getRedisClient();
    // eslint-disable-next-line consistent-return
    redisClient.del(token)
        .then(() => {
            console.log('Token is deleted.');
        })
        .catch(err => {
            console.log('Token cannot be deleted.');
            console.error(err);

            return sendError(
                res,
                statusCodes.SERVER_ERROR,
                'Logout failed.',
                'error'
            );
        })

    return sendSuccess(
        res,
        statusCodes.OK,
        'Logout successful.',
        'success'
    );
}
