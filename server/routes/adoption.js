// importing libraries
import express from 'express';

// importing error handlers
import { catchErrors } from '../configs/errorHandlers.js';

// importing controllers
import {
    putPetOnAdoption,
    completeAdoption,
    getAdoptionRecord,
    getPetAvailableForAdoption,
    deleteAdoptionStatus,
    sendAdoptionRequestForPet,
    cancelAdoptionRequestForPet,
    getAdoptionRequests
} from '../controllers/adoption.js';

// importing middleware
import { allAuth } from '../middleware/auth.js';

const router = express.Router();

/**
 * Available routes.
 *
 * put pet on adoption 
 * adopt pet
 * get all adoption record of user
 * remove pet from adoption
 * complete adoption
 * send adoption request for pet
 * 
 */

// POST: put pet on adoption
router.post('/put-pet-on-adoption/:petId', allAuth, catchErrors(putPetOnAdoption));

// POST: adopt pet
router.post('/complete-adoption', allAuth, catchErrors(completeAdoption));

// GET: get all adoption record of user
router.get('/record', allAuth, catchErrors(getAdoptionRecord));

// GET: all pets available for adoption
router.get('/get-all-pets', allAuth, catchErrors(getPetAvailableForAdoption));

// GET: get adoption requests using pet Id
router.get('/get/pet-adoption-request/:petId', allAuth, catchErrors(getAdoptionRequests));

// DELETE: delete pet for adoption
router.delete('/delete/:petId', allAuth, catchErrors(deleteAdoptionStatus));

// POST: send adoption request for pet
router.post('/request-adoption/:petId', allAuth, catchErrors(sendAdoptionRequestForPet));

// POST: cancel adoption request for pet
router.post('/cancel-adoption-request/:petId', allAuth, catchErrors(cancelAdoptionRequestForPet));

export default router;