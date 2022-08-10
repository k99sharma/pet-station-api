// importing modules
const express = require('express')
const router = express.Router()

// importing error handlers
const { catchErrors } = require('../../configs/errorHandlers')

// importing controllers
const CONTROLLERS = require('../../controllers/services/email')

// importing middlewares
// const { allAuth, adminAuth } = require('../middlewares/auth')

/**
 * Provided routes for user
 *
 * Send test email.
 */

router.post('/test', catchErrors(CONTROLLERS.testMail));

module.exports = router;