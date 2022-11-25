// importing libraries
import express from 'express';

// importing error handlers
import { catchErrors } from '../configs/errorHandlers.js';

// importing controllers
import {
    signup,
    login
} from '../controllers/auth.js';

const router = express.Router();

/**
 * Available routes.
 * 
 * POST: sign up
 * POST: login
 * POST: reset password
 * POST: logout
 */

// POST: sign up
router.post('/signup', catchErrors(signup));

// POST: login
router.post('/login', catchErrors(login));

export default router;
