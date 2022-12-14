// USER CONTROLLERS

// importing schemas
import User from '../schemas/User.js';
import Username from '../schemas/Username.js';

// importing status codes
import statusCodes from '../utilities/statusCodes.js';

// importing error handlers
import { sendSuccess, sendError } from '../utilities/errorHelper.js';

// importing redis client
import { getRedisClient } from '../configs/redisConnection.js';

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
    if (!user || !user.active)
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
        gender: user.gender,
        petAdoptionRequest: user.petAdoptionRequest
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

// PUT: update username
export async function changeUsername(req, res) {
    const { userId } = req.user;
    const { newUsername } = req.body;

    Username.findOneAndUpdate({ UID: userId }, {
        username: newUsername
    })
        .then(() => {
            console.log('Username is updated.');
        })
        .catch(err => {
            console.log('Username cannot be updated.');
            console.error(err);

            return sendError(
                res,
                statusCodes.SERVER_ERROR,
                'Username cannot be updated.',
                'error'
            );
        })

    return sendSuccess(
        res,
        statusCodes.OK,
        'Username updated.',
        'success'
    );
}

// PUT: update user details
export async function updateUser(req, res) {
    const { userId } = req.user;
    const updateData = req.body;

    User.findOneAndUpdate({ UID: userId }, updateData)
        .then(() => {
            console.log('User data updated.');
        })
        .catch(err => {
            console.log('User data cannot be updated.');
            console.error(err);

            return sendError(
                res,
                statusCodes.SERVER_ERROR,
                'User data cannot be updated.',
                'error'
            );
        })

    return sendSuccess(
        res,
        statusCodes.UPDATED,
        'User can be updated.',
        'success'
    );
}

// DELETE: delete user
export async function deleteUser(req, res) {
    const { userId } = req.user;

    // delete token
    const token = req.header('x-auth-token');
    // delete token from redis
    const redisClient = getRedisClient();
    // eslint-disable-next-line consistent-return
    redisClient.del(token)
        .then(() => {
            console.log('Token is deleted.');

            User.findOneAndUpdate({ UID: userId }, {
                active: false
            })
                .then(() => {
                    console.log('User active status made inactive.');
                })
                .catch(err => {
                    console.log('User active state cannot be changed.');
                    console.error(err);

                    return sendError(
                        res,
                        statusCodes.SERVER_ERROR,
                        'User cannot be deleted.',
                        'error'
                    );
                })
        })
        .catch(err => {
            console.log('Token cannot be deleted.');
            console.error(err);

            return sendError(
                res,
                statusCodes.SERVER_ERROR,
                'User cannot be deleted.',
                'error'
            );
        })

    return sendSuccess(
        res,
        statusCodes.OK,
        'User is deleted.',
        'success'
    );
}

// GET: check if username is valid
export async function verifyUsername(req, res) {
    const { username } = req.body;

    // check if username is already in use
    const isPresent = await Username.findOne({ username });

    return sendSuccess(
        res,
        statusCodes.OK,
        {
            msg: isPresent ? 'Username is not valid.' : 'Username is valid.',
            valid: !isPresent
        },
        'success'
    );
}