// importing modules
const express = require('express');
const router = express.Router();

// importing error handlers
const { catchErrors } = require('../configs/errorHandlers');

// importing controllers
const CONTROLLERS = require('../controllers/auth');

/**
 * Provided routes for authentication
 *  
 * Login route.
 * Signup route.
 * Logout route.
 */

// POST: user login 
router.post('/login', catchErrors(CONTROLLERS.userLogin));

// POST: user logout
router.post('/logout', catchErrors(CONTROLLERS.userLogout));

module.exports = router;