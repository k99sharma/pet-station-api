// importing libraries
import express from 'express';

// importing error handlers
import { catchErrors } from '../configs/errorHandlers.js';

// importing controllers
import {
    createNewPet,
    getAllUserPets,
    getAllUserPetsForAdoption,
    getPet,
    deletePet,
    getOwnerId
} from '../controllers/pet.js';

// importing middleware
import { allAuth } from '../middleware/auth.js';

const router = express.Router();

/**
 * Available routes.
 * 
 * Create new pet
 * get all user pets using user Id
 * get all user pets for adoption using user Id
 * get pet using UID
 * delete pet using pet UID
 * get owner Id
 */

// POST: create new pet
router.post('/create', allAuth, catchErrors(createNewPet));

// GET: get all user pets using user Id
router.get('/get-all', allAuth, catchErrors(getAllUserPets));

// GET: get all user pets for adoption using userId
router.get('/get-all-adoption', allAuth, catchErrors(getAllUserPetsForAdoption));

//  GET: get pet using UID
router.get('/get/:petId', allAuth, catchErrors(getPet));

// DELETE: delete pet using UID
router.delete('/delete/:petId', allAuth, catchErrors(deletePet));

// GET: get owner Id
router.get('/get-owner-id/:petId', allAuth, catchErrors(getOwnerId));

export default router;