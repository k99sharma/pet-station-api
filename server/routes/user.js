// importing libraries
import express from 'express';

// importing error handlers
import { catchErrors } from '../configs/errorHandlers.js';

// importing middleware
import { allAuth } from '../middleware/auth.js';

// importing controllers
import {
    getUserByUID,
    changeUsername,
    updateUser,
    deleteUser,
    verifyUsername,
    addFriend,
    getFriends
} from '../controllers/user.js';

const router = express.Router();

/**
 * Available routes.
 * 
 * GET: get user details using UID
 * PUT: change username
 * PUT: change profile picture
 * PUT: update user details
 * DELETE: delete user
 * GET: check if username is valid or not
 */

// GET: get user details using UID
router.get('/get', allAuth, catchErrors(getUserByUID));

// PUT: username update
router.put('/update-username', allAuth, catchErrors(changeUsername));

// PUT: update user details
router.put('/update', allAuth, catchErrors(updateUser));

// DELETE: delete user
router.delete('/delete', allAuth, catchErrors(deleteUser));

// GET: check if username is valid
router.get('/verify-username', allAuth, catchErrors(verifyUsername));

// POST: add friend to user
router.post('/friend/add/:friendId', allAuth, catchErrors(addFriend));

// GET: get all friends
router.get('/friend/get', allAuth, catchErrors(getFriends));

export default router;