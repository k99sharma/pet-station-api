// ADOPTION CONTROLLER

// importing schemas
import AdoptionLocker from '../schemas/AdoptionLocker.js';
import Adoption from '../schemas/Adoption.js';
import Pet from '../schemas/Pet.js';

// importing response format
import { sendError, sendSuccess } from '../utilities/errorHelper.js';

// importing helper functions
import { decrypt, encrypt } from '../utilities/helper.js';

// importing status codes
import statusCodes from '../utilities/statusCodes.js';

// put pet on adoption
export async function putPetOnAdoption(req, res) {
    const { userId } = req.user;
    const { petId } = req.params;

    // set pet adoption status to pending
    Pet.findOneAndUpdate({ userId }, {
        adoptionStatus: 'pending'
    })
        .then(() => {
            console.log('Pet is removed from pet locker.');
        })
        .catch(err => {
            console.log('Pet cannot be removed from pet locker.');
            console.error(err);
        })

    // new instance
    const adoptionLockerInstance = new AdoptionLocker({
        userId,
        petId
    });

    adoptionLockerInstance.save()
        .then(() => {
            console.log('Pet is put on adoption.');
        })
        .catch(err => {
            console.log('Pet cannot be put on adoption.');
            console.error(err);

            return sendError(
                res,
                statusCodes.SERVER_ERROR,
                'Pet cannot be put on adoption.',
                'error'
            );
        })

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

    // remove pet from adoption locker

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

    if ((await adoptionRecord).length === 0)
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
    // paging parameters
    const limit = parseInt(req.query.limit, 10);
    const { cursor } = req.query;

    // response data holder
    let petsForAdoption = [];

    // if cursor is present
    if (cursor) {
        // decrypt the cursor
        const decryptedCursor = decrypt(cursor);

        // convert into date value
        const decryptedDate = new Date(decryptedCursor * 1000);

        // query for users according to cursor
        petsForAdoption = await Pet.find({
            createdAt: {
                $lt: decryptedDate
            }
        })
            .sort({ createdAt: -1 })
            .limit(limit + 1)
    } else {
        petsForAdoption = await Pet.find({})
            .sort({ createdAt: -1 })
            .limit(limit + 1)
    }

    // checking if there are more documents
    const hasMore = petsForAdoption.length === limit + 1;   // boolean value
    let nextCursor = null;

    // if limit is reached
    if (hasMore) {
        const nextCursorRecord = petsForAdoption[limit];

        const unixTimestamp = Math.floor(
            nextCursorRecord.createdAt.getTime() / 1000
        );

        nextCursor = encrypt(unixTimestamp.toString());

        // removing last record from data
        petsForAdoption.pop();
    }


    // mapping data to return as response
    petsForAdoption = petsForAdoption.map(pet => {
        const mappedData = {
            petId: pet.UID,
            name: pet.name,
            description: pet.description,
            imageUrl: pet.imageUrl,
            category: pet.category,
            breed: pet.breed,
            ownerId: pet.ownerId,
            age: pet.age,
            weight: pet.weight,
            adoptionStatus: pet.adoptionStatus
        };

        return mappedData;
    });

    // if no pet is present
    if (petsForAdoption.length === 0)
        return sendSuccess(
            res,
            statusCodes.OK,
            {
                msg: 'No pets for adoption.',
                count: 0,
                data: []
            },
            'success'
        );


    return sendSuccess(
        res,
        statusCodes.OK,
        {
            msg: 'Pet available for adoption.',
            count: petsForAdoption.length,
            data: petsForAdoption,
            paging: {
                hasMore,
                nextCursor
            }
        },
        'success'
    );
}

// remove pet from adoption
export async function deleteAdoptionStatus(req, res) {
    const { petId } = req.params;

    // updating pet adoption status
    await Pet.findOneAndUpdate({ petId }, {
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