// controllers for auth routes

// importing schemas
import User from '../schemas/User.js';

// importing status codes
import statusCodes from '../utilities/statusCodes.js';

// importing error handlers
import { sendSuccess, sendError } from '../utilities/errorHelper.js';

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

export function login(req, res) {
    return res.send('OK');
}