// importing modals
const AdoptionSession = require('../models/AdoptionSession');
const AdoptionList = require('../models/AdoptionList');
const Pet = require('../models/Pet');
const AdoptionRequest = require('../models/AdoptionRequest');
const AdoptionRecord = require('../models/AdoptionRecord');

// importing error handlers
const { sendSuccess, sendError } = require('../utils/errorHelper')

// importing status codes
const { NOT_FOUND, SERVER_ERROR, CONFLICT } = require('../utils/statusCodes')


// POST: put on adoption
const putPetForAdoption = async (req, res) => {
    const petId = req.params.petId;
    const userId = req.user.userId;

    // get pet and update adoption status
    let pet = await Pet.findOneAndUpdate({ petId: petId }, {
        adoptionStatus: 'pending'
    })

    const petDocumentId = pet._id;

    // check if an adoption session is present for user
    let adoptionSession = await AdoptionSession.findOne({ userId: userId });

    // if no adoption data is found
    if (!adoptionSession) {
        adoptionSession = new AdoptionSession({
            userId: userId
        })

        await adoptionSession.save()
            .then(() => {
                console.log('New adoption session is created for user.');
            })
            .catch(err => {
                console.log('Cannot create new session for user');
                console.error(err);
                return sendError(res, 'Unable to put pet for adoption', SERVER_ERROR);
            })
    }

    // get the session id
    const sessionId = adoptionSession._id;

    // check if pet is already present for adoption
    const isAvailable = await AdoptionList.findOne({
        sessionId: sessionId,
        petId: petDocumentId
    })

    if (isAvailable)
        return sendError(res, 'Pet is already available for adoption', CONFLICT);

    // now we are gonna put for adoption
    const putForAdoption = new AdoptionList({
        sessionId: sessionId,
        petId: petDocumentId
    })

    // save pet put for adoption
    await putForAdoption.save()
        .then(() => {
            console.log('Pet is put for adoption');
        })
        .catch(err => {
            console.error(err)
            return sendError(res, 'Unable to put pet for adoption', SERVER_ERROR);
        })

    return sendSuccess(res, 'Pet is up for adoption');
}


// GET: get all pets up for adoption by owner
const getAllUserPetsForAdoption = async (req, res) => {
    const ownerId = req.params.ownerId;

    // check if there is available session for user
    const availableSession = await AdoptionSession.findOne({ userId: ownerId })

    if (!availableSession)
        return sendSuccess(res, []);

    const petsList = await AdoptionList.find({
        sessionId: String(availableSession._id)
    }).populate('petId')


    // response data
    const data = []
    for (let pet of petsList) {
        data.push({
            name: pet.petId.name,
            breed: pet.petId.breed,
            category: pet.petId.category,
            age: pet.petId.age,
            weight: pet.petId.weight,
            gender: pet.petId.gender,
            petId: pet.petId.petId,
            ownerId: pet.petId.ownerId,
        })
    }

    if (data.length === 0)
        return sendSuccess(res, [])

    return sendSuccess(res, data);
}

// DELETE: remove pet from adoption
const removePet = async (req, res) => {
    let petId = req.params.petId;
    const ownerId = req.user.userId;

    // get session id of user -> we are assuming it is always present
    const session = await AdoptionSession.findOne({ userId: ownerId });
    const sessionId = session._id;  // session id

    const pet = await Pet.findOne({ petId: petId })
    petId = pet._id;        // pet document Id

    const adoptionInstance = await AdoptionList.findOne({
        petId: petId,
        sessionId: sessionId
    })

    if (!adoptionInstance)
        return sendError(res, 'Invalid pet Id.', NOT_FOUND)

    // deleting instance
    await AdoptionList.findByIdAndDelete(adoptionInstance._id)
        .then(() => {
            console.log('Pet adoption instance is deleted!')
        })
        .catch(err => {
            console.log('Pet adoption instance cannot be deleted')
            console.error(err)
            return sendError(res, 'Unable to remove pet.', SERVER_ERROR);
        })

    return sendSuccess(res, 'Pet is removed from adoption list.');
}

// POST: send adoption request
const sendAdoptionRequest = async (req, res) => {
    const userId = req.params.userId;
    const { ownerId, petId } = req.body;

    // request data
    const newRequest = {
        userId: userId,
        petId: petId
    }

    // create adoption request 
    let adoptionRequest = await AdoptionRequest.findOne({ userId: ownerId });
    if (!adoptionRequest) {
        adoptionRequest = new AdoptionRequest({
            userId: ownerId
        })

        // save instance
        await adoptionRequest.save()
            .then(() => {
                console.log('New adoption request');
            })
            .catch(err => {
                console.log('Failed to make request');
                console.error(err);
                return sendError(res, 'Unable to send request', SERVER_ERROR);
            })
    }

    // push request data 
    const adoptionRequestId = adoptionRequest._id;
    await AdoptionRequest.findByIdAndUpdate(adoptionRequestId, {
        $push: {
            requests: newRequest
        }
    })


    return sendSuccess(res, 'Request is sent!');
}

// GET: get all pets available for adoption
const getAllPets = async (req, res) => {
    const adoptionList = await AdoptionList.find({}).populate('petId');

    const data = []
    for (let pet of adoptionList) {
        data.push({
            data: {
                name: pet.petId.name,
                breed: pet.petId.breed,
                category: pet.petId.category,
                age: pet.petId.age,
                weight: pet.petId.weight,
                ownerId: pet.petId.ownerId,
                gender: pet.petId.gender,
                petId: pet.petId.petId,
            },
            adoptionStatus: pet.isAdopted
        })
    }

    return sendSuccess(res, data);
}

// POST: complete adoption for pet
const completeAdoption = async (req, res) => {
    const { userId } = req.user;
    const { petId } = req.params;

    const pet = await Pet.findOne({ petId: petId });

    // create new record of adoption for user
    const adoptionRecord = new AdoptionRecord({
        userId: userId,
        pet: pet
    })

    // adoption record is saved
    await adoptionRecord.save()
        .then(() => {
            console.log('Adoption Record is created.')
        })
        .catch(err => {
            console.error(err);
            console.log('Adoption record cannot be created.')
            return sendError(res, 'Adoption cannot be completed.', SERVER_ERROR)
        })

    // delete pet from adoption list
    await AdoptionList.findOneAndDelete({ userId: userId })
        .then(() => {
            console.log('Pet is deleted from adoption list.')
        })
        .catch(err => {
            console.error(err)
            console.log('Pet cannot be deleted from adoption list.')
        })

    // delete pet from pet 
    await Pet.findOneAndDelete({ userId: userId })
        .then(() => {
            console.log('Pet is deleted');
        })
        .catch(err => {
            console.error(err);
            console.log('pet cannot be deleted.');
        })

    return sendSuccess(res, 'Adoption is successful!');
}

module.exports = {
    putPetForAdoption,
    getAllUserPetsForAdoption,
    removePet,
    sendAdoptionRequest,
    getAllPets,
    completeAdoption
}
