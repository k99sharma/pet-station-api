// USER CONTROLLERS

// importing schemas
import User from '../schemas/User.js';
import Username from '../schemas/Username.js';

// importing status codes
import statusCodes from '../utilities/statusCodes.js';

// importing error handlers
import { sendSuccess, sendError } from '../utilities/errorHelper.js';

// GET: user details using UID
export async function getUserByUID(req, res) {
    const { userId } = req.user;

    // getting user
    const [user, username] = await Promise.all([
        User.findOne({ UID: userId }),
        Username.findOne({ UID: userId })
    ]);

    console.log(user);
    console.log(username);

    // if user does not exist
    if (!user)
        return sendError(
            res,
            statusCodes.NOT_FOUND,
            'User does not exist.',
            'fail'
        );

    // response data
    const data = {
        firstName: user.firstName,
        lastName: user.lastName,
        username:
            username.username === null
                ?
                user.firstName
                :
                username.username,
        profilePictureUrl: user.profilePictureUrl,
        email: user.email,
        phoneNumber: user.phoneNumber,
        address: user.address,
        gender: user.gender
    };

    return sendSuccess(
        res,
        statusCodes.OK,
        {
            msg: 'User found.',
            data
        },
        'success'
    );
}

// PUT: change username
export async function changeUsername(req, res) {
    res.send('aoiej')
}
