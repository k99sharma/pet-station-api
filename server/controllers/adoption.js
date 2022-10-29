// importing modals
const AdoptionSession = require('../models/AdoptionSession');
const AdoptionList = require('../models/AdoptionList');

// importing error handlers
const { sendSuccess, sendError } = require('../utils/errorHelper')

// importing status codes
const { NOT_FOUND, SERVER_ERROR, CONFLICT } = require('../utils/statusCodes')


// POST: put on adoption
const putPetForAdoption = async (req, res) => {
    const petId = req.params.petId;
    const userId = req.user.userId;

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
        petId: petId
    })

    if (isAvailable)
        return sendError(res, 'Pet is already available for adoption', CONFLICT);

    // now we are gonna put for adoption
    const putForAdoption = new AdoptionList({
        sessionId: sessionId,
        petId: petId
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



module.exports = {
    putPetForAdoption
}