// importing libraries
import express from 'express';

// importing error handlers
import { catchErrors } from '../configs/errorHandlers.js';

// importing controllers
import {
    signup,
    login,
    resetPassword,
    extendToken,
    logout
} from '../controllers/auth.js';

const router = express.Router();

/**
 * Available routes.
 * 
 * POST: sign up
 * POST: login
 * POST: reset password
 * GET: extend token
 * POST: logout
 */

// POST: sign up
router.post('/signup', catchErrors(signup));

// POST: login
router.post('/login', catchErrors(login));

// POST: reset password
router.post('/password/reset', catchErrors(resetPassword));

// GET: extend token
router.get('/token/extend', catchErrors(extendToken));

// POST: logout
router.post('/logout/:token', catchErrors(logout));

export default router;
