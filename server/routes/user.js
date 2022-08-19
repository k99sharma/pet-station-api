// importing modules
const express = require('express')
const router = express.Router()

// importing error handlers
const { catchErrors } = require('../configs/errorHandlers')

// importing controllers
const CONTROLLERS = require('../controllers/user')

// importing middlewares
const { allAuth, adminAuth } = require('../middlewares/auth')

/**
 * Provided routes for user
 *
 * Get user using email address. -> admin
 * Get user using user Id -> all
 * Check if user is valid or not -> admin
 * Get user login details -> admin
 * Update user details. -> all
 * Delete user details. -> all
 */


// GET: user using email address
router.get(
    '/getUserByEmail',
    adminAuth,
    catchErrors(CONTROLLERS.getUserByEmail)
)

// GET: user using userId
router.get('/getUserById', allAuth, catchErrors(CONTROLLERS.getUserByUserId))

// GET: check if user exists using email address
router.get('/validUser', adminAuth, catchErrors(CONTROLLERS.isUserValid))

// GET: get all users using offset and limit
router.get('/getAllUsers', adminAuth, catchErrors(CONTROLLERS.getAllUsers))

// GET: get login details
router.get(
    '/logindetails/:userId',
    adminAuth,
    catchErrors(CONTROLLERS.getLoginDetails)
)

// PUT: update user data
router.put('/update/:type', allAuth, catchErrors(CONTROLLERS.updateUser))

// DELETE: delete user
router.delete('/delete', allAuth, catchErrors(CONTROLLERS.deleteUser))

module.exports = router
