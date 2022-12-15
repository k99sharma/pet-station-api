// ADOPTION CONTROLLER

// importing schemas
// import AdoptionLocker from '../schemas/AdoptionLocker.js';
import Adoption from '../schemas/Adoption.js';
import Pet from '../schemas/Pet.js';
import User from '../schemas/User.js';

// importing response format
import { sendError, sendSuccess } from '../utilities/errorHelper.js';

// importing status codes
import statusCodes from '../utilities/statusCodes.js';

// put pet on adoption
export async function putPetOnAdoption(req, res) {
    const { petId } = req.params;

    // set pet adoption status to pending
    const pet = await Pet.findOneAndUpdate({
        UID: petId
    }, {
        adoptionStatus: 'pending'
    });

    if (!pet)
        return sendError(
            res,
            statusCodes.SERVER_ERROR,
            'Pet cannot be put on adoption',
            'error'
        );

    return sendSuccess(
        res,
        statusCodes.OK,
        'Pet put on adoption.',
        'success'
    );
}

// adopt pet
export async function completeAdoption(req, res) {
    const { userId } = req.user;

    const {
        petId,
        userWhoAdoptedPet
    } = req.body;

    // delete pet from user pet locker
    Pet.findOneAndDelete({ UID: petId })
        .then(() => {
            console.log('Pet is deleted from user locker');
        })
        .catch(err => {
            console.error(err);
            console.log('Pet cannot be deleted from user locker');
        })

    // remove pet Id from pet and user adoption array
    Pet.findOneAndUpdate({
        UID: petId
    }, {
        $pull: {
            adoptionRequest: userId
        }
    },
        {
            upsert: true
        })
        .then(() => {
            User.findOneAndUpdate({
                UID: userId
            }, {
                $pull: {
                    petAdoptionRequest: petId
                }
            })
                .then(() => sendSuccess(
                    res,
                    statusCodes.OK,
                    'Adoption request is cancelled.',
                    'success'
                ))
                .catch(err => {
                    console.error(err);

                    return sendError(
                        res,
                        statusCodes.SERVER_ERROR,
                        'Adoption request is not cancelled.',
                        'error'
                    );
                })
        })
        .catch(err => {
            console.error(err);

            return sendError(
                res,
                statusCodes.SERVER_ERROR,
                'Adoption request is not cancelled.',
                'error'
            );
        })


    // creating new adoption required
    const adoption = new Adoption({
        userId,
        petId,
        adoptedBy: userWhoAdoptedPet
    });

    adoption.save()
        .then(() => {
            console.log('Adoption is completed.')
        })
        .catch(err => {
            console.log('Adoption is not successful.');
            console.error(err);
        })

    return sendSuccess(
        res,
        statusCodes.OK,
        'Adoption is completed.',
        'success'
    );
}

// adoption record
export async function getAdoptionRecord(req, res) {
    const { userId } = req.user;

    const adoptionRecord = await Adoption.find({ userId });

    if (adoptionRecord.length === 0)
        return sendSuccess(
            res,
            statusCodes.OK,
            {
                msg: 'No adoption record found.',
                count: 0,
                data: []
            },
            'success'
        );

    return sendSuccess(
        res,
        statusCodes.OK,
        {
            msg: 'Adoption record found.',
            count: adoptionRecord.length,
            data: adoptionRecord
        },
        'success'
    );
}

// get all pets available for adoption
export async function getPetAvailableForAdoption(req, res) {
    const { userId } = req.user;

    // getting all pets available for adoption
    let pets = await Pet.find({
        adoptionStatus: 'pending'
    });

    pets = pets.filter(pet => pet.ownerId !== userId).map(pet => {
        const mappedPet = {
            petId: pet.UID,
            name: pet.name,
            description: pet.description,
            imageUrl: pet.imageUrl,
            category: pet.category,
            breed: pet.breed,
            ownerId: pet.ownerId,
            age: pet.age,
            weight: pet.weight,
            adoptionRequest: pet.adoptionRequest,
            adoptionStatus: pet.adoptionStatus
        }

        return mappedPet;
    })

    // if no pets is available
    if (!pets)
        return sendSuccess(
            res,
            statusCodes.OK,
            {
                msg: 'No pet is available.',
                pets: []
            },
            'success'
        );

    return sendSuccess(
        res,
        statusCodes.OK,
        {
            msg: 'Pet adoption',
            count: pets.length,
            pets
        },
        'success'
    )
}

// get adoption requests of user
export async function getAdoptionRequests(req, res) {
    // params
    const { petId } = req.params;

    const pet = await Pet.findOne({ UID: petId });

    let requests = pet.adoptionRequest;   // requests

    if (requests.length === 0)
        return sendSuccess(
            res,
            statusCodes.OK,
            {
                msg: 'No available requests.',
                count: 0,
                requests: []
            },
            'success'
        );

    requests = requests.map(requestId => User.findOne({ UID: requestId }));

    requests = await Promise.all(requests);

    requests = requests.map(user => {
        const mappedData = {
            userId: user.UID,
            profilePictureUrl: user.profilePictureUrl,
            name: `${user.firstName} ${user.lastName}`
        }

        return mappedData;
    });

    return sendSuccess(
        res,
        statusCodes.OK,
        {
            msg: 'Available requests.',
            count: requests.length,
            requests
        },
        'success'
    );
}

// remove pet from adoption
export async function deleteAdoptionStatus(req, res) {
    const { petId } = req.params;

    // updating pet adoption status
    await Pet.findOneAndUpdate({ UID: petId }, {
        adoptionStatus: 'none'
    })
        .then(() => {
            console.log('Pet is removed from adoption list.');
        })
        .catch(err => {
            console.log('Pet cannot be removed from adoption list.');
            console.error(err);

            return sendError(
                res,
                statusCodes.SERVER_ERROR,
                'Pet cannot be removed from adoption list.',
                'error'
            );
        })

    return sendSuccess(
        res,
        statusCodes.OK,
        'Pet removed from adoption list.',
        'success'
    );
}


// POST: adoption request
export async function sendAdoptionRequestForPet(req, res) {
    const { petId } = req.params;
    const { userId } = req.user;

    Pet.findOneAndUpdate({
        UID: petId
    }, {
        $push: {
            adoptionRequest: userId
        }
    },
        {
            upsert: true
        })
        .then(() => {
            User.findOneAndUpdate({
                UID: userId
            }, {
                $push: {
                    petAdoptionRequest: petId
                }
            })
                .then(() => sendSuccess(
                    res,
                    statusCodes.OK,
                    'Adoption request is send.',
                    'success'
                ))
                .catch(err => {
                    console.error(err);

                    return sendError(
                        res,
                        statusCodes.SERVER_ERROR,
                        'Adoption request is not sent.',
                        'error'
                    );
                })
        })
        .catch(err => {
            console.error(err);

            return sendError(
                res,
                statusCodes.SERVER_ERROR,
                'Adoption request is not sent.',
                'error'
            );
        })
}

// POST: adoption request
export async function cancelAdoptionRequestForPet(req, res) {
    const { petId } = req.params;
    const { userId } = req.user;

    Pet.findOneAndUpdate({
        UID: petId
    }, {
        $pull: {
            adoptionRequest: userId
        }
    },
        {
            upsert: true
        })
        .then(() => {
            User.findOneAndUpdate({
                UID: userId
            }, {
                $pull: {
                    petAdoptionRequest: petId
                }
            })
                .then(() => sendSuccess(
                    res,
                    statusCodes.OK,
                    'Adoption request is cancelled.',
                    'success'
                ))
                .catch(err => {
                    console.error(err);

                    return sendError(
                        res,
                        statusCodes.SERVER_ERROR,
                        'Adoption request is not cancelled.',
                        'error'
                    );
                })
        })
        .catch(err => {
            console.error(err);

            return sendError(
                res,
                statusCodes.SERVER_ERROR,
                'Adoption request is not cancelled.',
                'error'
            );
        })
}
