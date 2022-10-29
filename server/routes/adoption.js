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
 * Put pet on adoption -> done
 * Get all available pet for adoption
 * Adopt a pet
 * Remove pet from adoption -> done
 * Check adoption history
 * Get all pet put on adoption using owner Id -> done
 * Get all adopted pets using owner Id
 * Send adoption request -> done
 * Accept adoption request
 */


// POST: put pet for adoption
router.post('/putPetForAdoption/:petId', allAuth, catchErrors(CONTROLLERS.putPetForAdoption));

// GET: see all user available pet for adoption
router.get('/get/allUserPetsForAdoption/:ownerId', allAuth, catchErrors(CONTROLLERS.getAllUserPetsForAdoption));

// DELETE: remove pet from adoption list
router.delete('/delete/:petId', allAuth, catchErrors(CONTROLLERS.removePet));

// POST: make an adoption request
router.post('/adoptionRequest/send/:userId', allAuth, catchErrors(CONTROLLERS.sendAdoptionRequest));

// GET: get all pets available for adoption
router.get('/getAllPets', allAuth, catchErrors(CONTROLLERS.getAllPets));

module.exports = router;