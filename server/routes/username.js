// importing modules
const express = require('express')
const router = express.Router()

// importing error handlers
const { catchErrors } = require('../configs/errorHandlers')

// importing controllers
const CONTROLLERS = require('../controllers/username')

// importing middleware
const { allAuth, adminAuth } = require('../middleware/auth')

/**
 * Provided routes for username
 *
 * Check if username exists. -> all
 * Change username of user. -> all
 * Get all usernames with limit and cursor. -> admin
 */

// GET: check if username exists
router.get('/checkUsername', allAuth, catchErrors(CONTROLLERS.checkUsername))

// GET: get all usernames using cursor and limit
router.get(
    '/getAllUsernames',
    adminAuth,
    catchErrors(CONTROLLERS.getAllUsernames)
)

// PUT: change username
router.put('/update', allAuth, catchErrors(CONTROLLERS.changeUsername))

module.exports = router
