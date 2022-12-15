// PET CONTROLLERS

// importing schemas
import Pet from '../schemas/Pet.js';
import PetLocker from '../schemas/PetLocker.js';

// importing response handlers
import { sendError, sendSuccess } from '../utilities/errorHelper.js';

// importing status codes
import statusCodes from '../utilities/statusCodes.js';

// create new pet
export async function createNewPet(req, res) {
    // getting user Id 
    const { userId } = req.user;

    // new pet instance
    let newPet = new Pet({
        ownerId: userId,
        ...req.body
    });

    // get user pet locker
    let petLocker = await PetLocker.findOne({ userId });

    // check if user have locker or not
    if (petLocker === null) {
        // save the pet
        newPet = await newPet.save();
        if (newPet) {
            console.log('New pet is created.');
        } else {
            console.log('New pet cannot be created.');

            return sendError(
                res,
                statusCodes.SERVER_ERROR,
                'New pet cannot be created.',
                'error'
            );
        }

        // create new locker
        petLocker = new PetLocker({ userId })
        petLocker.locker.push(newPet.UID);      // add pet id in locker

        // save locker
        petLocker.save()
            .then(() => {
                console.log('Pet added in locker.');
            })
            .catch(err => {
                console.log('Pet cannot be added in locker.');
                console.error(err);
            })
    } else {
        // check if locker reach its limit
        if (petLocker.locker.length === 5)
            return sendError(
                res,
                statusCodes.NOT_ACCEPTABLE,
                'Maximum pets limit reached.',
                'fail'
            );


        // save the pet
        newPet = await newPet.save();
        if (newPet) {
            console.log('New pet is created.');
        } else {
            console.log('New pet cannot be created.');

            return sendError(
                res,
                statusCodes.SERVER_ERROR,
                'New pet cannot be created.',
                'error'
            );
        }

        // add pet id into locker
        PetLocker.findOneAndUpdate({ userId }, {
            $push: {
                locker: newPet.UID
            }
        })
            .then(() => {
                console.log('Pet added in locker.');
            })
            .catch(err => {
                console.log('Pet cannot be added in locker.');
                console.error(err);

                return sendError(
                    res,
                    statusCodes.SERVER_ERROR,
                    'Pet cannot be created.',
                    'error'
                );
            })
    }

    return sendSuccess(
        res,
        statusCodes.OK,
        'Pet is created.',
        'success'
    )
}

// get all user pets using user Id
export async function getAllUserPets(req, res) {
    // getting user Id
    const { userId } = req.user;

    // finding locker
    const petLocker = await PetLocker.findOne({ userId });

    // if locker is not present or locker is empty
    if (!petLocker || petLocker.locker.length === 0)
        return sendSuccess(
            res,
            statusCodes.OK,
            {
                msg: 'No available pets.',
                data: {
                    count: 0,
                    pets: []
                }
            }
        );

    // getting all pets from id
    const locker = petLocker.locker.map(id => Pet.findOne({ UID: id }));

    // user pets
    let pets = await Promise.all(locker);

    pets = pets.filter(pet => pet !== null).map(pet => {
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
            adoptionRequest: pet.adoptionRequest,
            adoptionStatus: pet.adoptionStatus
        }

        return mappedData;
    })


    return sendSuccess(
        res,
        statusCodes.OK,
        {
            msg: 'Available pets.',
            data: {
                count: pets.length,
                pets
            }
        },
        'success'
    );
}

// get all adoption pets
export async function getAllUserPetsForAdoption(req, res) {
    // getting user Id
    const { userId } = req.user;

    // finding locker
    const petLocker = await PetLocker.findOne({ userId });

    // if locker is not present or locker is empty
    if (!petLocker || petLocker.locker.length === 0)
        return sendSuccess(
            res,
            statusCodes.OK,
            {
                msg: 'No available pets.',
                data: {
                    count: 0,
                    pets: []
                }
            }
        );

    // getting all pets from id
    const locker = petLocker.locker.map(id => Pet.findOne({ UID: id }));

    // user pets
    let pets = await Promise.all(locker);

    // get available pets for adoption
    pets = pets
        .filter(pet => pet !== null)
        .filter(pet => pet.adoptionStatus === 'pending')
        .map(pet => {
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
                adoptionRequest: pet.adoptionRequest,
                adoptionStatus: pet.adoptionStatus
            }

            return mappedData;
        });

    return sendSuccess(
        res,
        statusCodes.OK,
        {
            msg: 'Available pets.',
            data: {
                count: pets.length,
                pets
            }
        },
        'success'
    );
}

// get pet using UID
export async function getPet(req, res) {
    const { petId } = req.params;

    // get pet
    let pet = await Pet.findOne({ UID: petId })

    if (!pet)
        return sendError(
            res,
            statusCodes.NOT_FOUND,
            'Pet not found.',
            'fail'
        );

    pet = {
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
    }

    return sendSuccess(
        res,
        statusCodes.OK,
        {
            msg: 'Pet found.',
            pet
        },
        'success'
    );
}

// delete pet using UID
export async function deletePet(req, res) {
    const { petId } = req.params;
    const { userId } = req.user;

    PetLocker.findOneAndUpdate({ userId }, {
        $pull: {
            locker: petId
        }
    })
        .then(() => {
            console.log('Pet is removed from locker.')

            Pet.findOneAndDelete({ UID: petId })
                .then(() => {
                    console.log('Pet is deleted.');
                })
                .catch(err => {
                    console.log('Pet cannot be deleted.');
                    console.error(err);
                })
        })
        .catch(err => {
            console.log('Pet cannot be removed from locker.');
            console.error(err);

            return sendError(
                res,
                statusCodes.SERVER_ERROR,
                'Pet cannot be deleted',
                'error'
            );
        })


    return sendSuccess(
        res,
        statusCodes.OK,
        'Pet is deleted.',
        'success'
    );
}

// get owner Id
export async function getOwnerId(req, res) {
    const { petId } = req.params;

    // get pet
    const pet = await Pet.findOne({ UID: petId });

    // if pet not found
    if (!pet)
        return sendError(
            res,
            statusCodes.NOT_FOUND,
            'Pet not found.',
            'fail'
        );

    return sendSuccess(
        res,
        statusCodes.OK,
        {
            msg: 'Owner Id',
            ownerId: pet.ownerId
        },
        'success'
    );
}