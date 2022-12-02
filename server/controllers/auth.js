// controllers for auth routes

// importing schemas
import User from '../schemas/User.js';

// importing status codes
import statusCodes from '../utilities/statusCodes.js';

// importing error handlers
import { sendSuccess, sendError } from '../utilities/errorHelper.js';

// import redis client
import { getRedisClient } from '../configs/redisConnection.js';

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
    const isPasswordValid = await user.isValidPassword(password);

    if (!isPasswordValid)
        return sendError(
            res,
            statusCodes.FORBIDDEN,
            'Email or password is invalid.',
            'fail'
        );

    // generate auth token
    // send this token in response
    const generatedToken = user.generateAuthToken();

    // add value in redis cache
    const redisClient = getRedisClient();
    await redisClient.set(generatedToken, 'true');
    redisClient.expire(generatedToken, 60 * 60 * 24 * 7);     // token expiration

    return sendSuccess(
        res,
        statusCodes.OK,
        {
            msg: 'Login is successful.',
            token: generatedToken
        },
        'success'
    );
}