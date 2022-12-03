// importing libraries
import express from 'express';

// importing error handlers
import { catchErrors } from '../configs/errorHandlers.js';

// importing middleware
import { allAuth } from '../middleware/auth.js';

// importing controllers
import {
    getUserByUID
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

router.get('/get', allAuth, catchErrors(getUserByUID));

export default router;