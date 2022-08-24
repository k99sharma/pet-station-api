// importing modules
const express = require('express');
const router = express.Router();

// importing error handlers
const { catchErrors } = require('../configs/errorHandlers')

// importing controllers
const CONTROLLERS = require('../controllers/pet')

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
router.post('/create', catchErrors(CONTROLLERS.createPet));

// GET: get pet using pet id
router.get('/get/:petId', catchErrors(CONTROLLERS.getPetById));

// GET: get pet using user id
router.get('/getAll/:userId', catchErrors(CONTROLLERS.getPetByUserId));

// GET: get user Id of pet
router.get('/getOwnerId/:petId', catchErrors(CONTROLLERS.getOwnerId));
 
// PUT: edit pet data
router.put('/update/:petId', catchErrors(CONTROLLERS.updatePet));

// DELETE: delete pet 
router.delete('/delete/:petId', catchErrors(CONTROLLERS.deletePet));


module.exports = router;