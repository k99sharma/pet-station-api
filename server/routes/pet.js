// importing modules
const express = require('express');
const router = express.Router();

// importing error handlers
const { catchErrors } = require('../configs/errorHandlers')

// importing controllers
const CONTROLLERS = require('../controllers/pet')

// importing middleware
const { allAuth } = require('../middleware/auth');

/**
 * Provided routes for authentication
 *
 * Create new pet.
 * Get pet using pet Id.
 * Get all pets using owner Id.
 * Get user Id of pet.
 * Edit pet.
 * Delete pet.
 */

// POST: create new pet
router.post('/create', allAuth, catchErrors(CONTROLLERS.createPet));

// GET: get pet using pet id
router.get('/get/:petId', allAuth, catchErrors(CONTROLLERS.getPetById));

// GET: get pet using owner id
router.get('/getAll/:ownerId', allAuth, catchErrors(CONTROLLERS.getPetByOwnerId));

// GET: get user Id of pet
router.get('/getOwnerId/:petId', allAuth, catchErrors(CONTROLLERS.getOwnerId));

// PUT: edit pet data
router.put('/update/:petId', allAuth, catchErrors(CONTROLLERS.updatePet));

// DELETE: delete pet 
router.delete('/delete/:petId', allAuth, catchErrors(CONTROLLERS.deletePet));


module.exports = router;