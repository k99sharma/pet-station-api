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
 * Get user using email address.
 * Get user using user Id
 * Check if user is valid or not
 */

// POST: create a new user
router.post('/create', catchErrors(CONTROLLERS.createUser));

// GET: user using email address
router.get('/getUserByEmail', catchErrors(CONTROLLERS.getUserByEmail));

// GET: user using userId
router.get('/getUserById', catchErrors(CONTROLLERS.getUserByUserId));

// GET: check if user exists using email address
router.get('/validUser', catchErrors(CONTROLLERS.isUserValid));

// GET: get all users using offset and limit
router.get('/getAllUsers', catchErrors(CONTROLLERS.getAllUsers));

// PUT: update user data
router.put('/update/:type/:userId', catchErrors(CONTROLLERS.updateUser));

// DELETE: delete user
router.delete('/delete/:userId', catchErrors(CONTROLLERS.deleteUser));

module.exports = router;