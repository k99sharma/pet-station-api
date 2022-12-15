// ADOPTION CONTROLLER

// importing schemas
// import AdoptionLocker from '../schemas/AdoptionLocker.js';
import Adoption from '../schemas/Adoption.js';
import Pet from '../schemas/Pet.js';
import User from '../schemas/User.js';

// importing response format
import { sendError, sendSuccess } from '../utilities/errorHelper.js';

// importing helper functions
// import { decrypt, encrypt } from '../utilities/helper.js';

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
    // // paging parameters
    // const limit = parseInt(req.query.limit, 10);
    // const { cursor } = req.query;

    // // response data holder
    // let petsForAdoption = [];

    // // if cursor is present
    // if (cursor) {
    //     // decrypt the cursor
    //     const decryptedCursor = decrypt(cursor);

    //     // convert into date value
    //     const decryptedDate = new Date(decryptedCursor * 1000);

    //     // query for users according to cursor
    //     petsForAdoption = await Pet.find({
    //         createdAt: {
    //             $lt: decryptedDate
    //         }
    //     })
    //         .sort({ createdAt: -1 })
    //         .limit(limit + 1)
    // } else {
    //     petsForAdoption = await Pet.find({})
    //         .sort({ createdAt: -1 })
    //         .limit(limit + 1)
    // }

    // // checking if there are more documents
    // const hasMore = petsForAdoption.length === limit + 1;   // boolean value
    // let nextCursor = null;

    // // if limit is reached
    // if (hasMore) {
    //     const nextCursorRecord = petsForAdoption[limit];

    //     const unixTimestamp = Math.floor(
    //         nextCursorRecord.createdAt.getTime() / 1000
    //     );

    //     nextCursor = encrypt(unixTimestamp.toString());

    //     // removing last record from data
    //     petsForAdoption.pop();
    // }


    // // mapping data to return as response
    // petsForAdoption = petsForAdoption.map(pet => {
    //     const mappedData = {
    //         petId: pet.UID,
    //         name: pet.name,
    //         description: pet.description,
    //         imageUrl: pet.imageUrl,
    //         category: pet.category,
    //         breed: pet.breed,
    //         ownerId: pet.ownerId,
    //         age: pet.age,
    //         weight: pet.weight,
    //         adoptionStatus: pet.adoptionStatus
    //     };

    //     return mappedData;
    // });

    // // if no pet is present
    // if (petsForAdoption.length === 0)
    //     return sendSuccess(
    //         res,
    //         statusCodes.OK,
    //         {
    //             msg: 'No pets for adoption.',
    //             count: 0,
    //             data: []
    //         },
    //         'success'
    //     );


    // return sendSuccess(
    //     res,
    //     statusCodes.OK,
    //     {
    //         msg: 'Pet available for adoption.',
    //         count: petsForAdoption.length,
    //         data: petsForAdoption,
    //         paging: {
    //             hasMore,
    //             nextCursor
    //         }
    //     },
    //     'success'
    // );

    // getting all pets available for adoption
    const pets = await Pet.find({
        adoptionStatus: 'pending'
    });

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
