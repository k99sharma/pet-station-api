// importing modules
const express = require('express');
const router = express.Router();

// importing error handlers
const { catchErrors } = require('../configs/errorHandlers');

// importing controllers
const CONTROLLERS = require('../controllers/user');

/**
 * Provided routes for user
 *  
 * Create a new user.
 * 
 */

// POST: create a new user
router.post('/create', catchErrors(CONTROLLERS.createUser));

module.exports = router;