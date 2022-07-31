// importing modules
const express = require('express');
const router = express.Router();

// importing error handlers
const { catchErrors } = require('../configs/errorHandlers');

// importing controllers
const CONTROLLERS = require('../controllers/username');

/**
 * Provided routes for username
 * 
 * Check if username exists.
 * Change username of user.
 * Get all usernames with limit and cursor.
 */

// GET: check if username exists
router.get('/checkUsername', catchErrors(CONTROLLERS.checkUsername));

// GET: get all usernames using cursor and limit
router.get('/getAllUsernames', catchErrors(CONTROLLERS.getAllUsernames));

// PUT: change username
router.put('/update/:userId', catchErrors(CONTROLLERS.changeUsername));

module.exports = router;