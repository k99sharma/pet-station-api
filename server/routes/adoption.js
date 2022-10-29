// importing modules
const express = require('express');
const router = express.Router();

// importing error handlers
const { catchErrors } = require('../configs/errorHandlers')

// importing controllers
const CONTROLLERS = require('../controllers/adoption')

// importing middleware
const { allAuth } = require('../middleware/auth');

/**
 * Provided routes for authentication
 * 
 * Put pet on adoption
 * See all available pet for adoption
 * Adopt a pet
 * Remove pet from adoption
 * Check adoption history
 * Get all pet put on adoption using owner Id
 * Get all adopted pets using owner Id
 * Send adoption request
 */


// POST: put pet on adoption
router.post('/putPetForAdoption/:petId', allAuth, catchErrors(CONTROLLERS.putPetForAdoption));

// // GET: see all available pet for adoption
// router.get('/get/allPetsForAdoption/:userId', allAuth, CONTROLLERS.);

module.exports = router;