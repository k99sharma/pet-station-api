// importing model
const Pet = require('../models/Pet')

// importing error handlers
const { sendSuccess, sendError } = require('../utils/errorHelper')

// importing status codes
const { NOT_FOUND, SERVER_ERROR } = require('../utils/statusCodes')

// POST: create new pet.
const createPet = async (req, res) => {
    const {
        name,
        breed,
        imageUrl,
        description,
        category,
        age,
        weight,
        ownerId,
        gender
    } = req.body;

    // creating new pet
    const newPet = new Pet({
        name: name,
        breed: breed.toLowerCase(),
        imageUrl: imageUrl,
        description: description,
        category: category.toLowerCase(),
        age: age,
        weight: weight,
        ownerId: ownerId,
        gender: gender.toLowerCase()
    });

    // saving new pet
    newPet.save()
        .then(() => {
            console.info(newPet);
            return sendSuccess(res, 'Pet created.');
        })
        .catch((err) => {
            console.error(err);
            return sendError(res, 'Pet cannot be created.', SERVER_ERROR);
        })
}

// GET: get pet using pet id
const getPetById = async (req, res) => {
    // getting pet Id
    const petId = req.params.petId;

    const pet = await Pet.findOne({ petId: petId });
    console.log(pet);
    // if pet not found
    if (!pet)
        return sendError(res, 'Invalid pet Id.', NOT_FOUND);

    // creating response
    const data = {
        name: pet.name,
        breed: pet.breed,
        category: pet.category,
        age: pet.age,
        weight: pet.weight,
        ownerId: pet.ownerId,
        gender: pet.gender
    }

    return sendSuccess(res, data);
}

// GET: get pet using user id
const getPetByOwnerId = async (req, res) => {
    // getting owner id
    const ownerId = req.params.ownerId;

    // console.log(userId);

    const petsCollection = await Pet.find({ ownerId: ownerId });

    console.log(petsCollection);

    // if no pets are found
    if (petsCollection.length === 0)
        return sendSuccess(res, []);

    // creating response
    // TODO: need to change the structure of json format
    // data hiding from client side
    const data = petsCollection;

    return sendSuccess(res, data);
}

// GET: get owner Id using pet Id
const getOwnerId = async (req, res) => {
    // getting pet Id
    const petId = req.params.petId;

    // checking if pet Id is valid
    const pet = await Pet.findOne({ petId: petId });
    if (!pet)
        return sendError(res, 'Invalid pet Id.', NOT_FOUND);


    const ownerId = pet.ownerId;

    return sendSuccess(res, ownerId);
}

// PUT: edit pet using pet id
const updatePet = async (req, res) => {
    // getting pet id
    const petId = req.params.petId;

    // getting updatable data
    const data = req.body;

    // checking if pet exists
    let pet = await Pet.findOne({ petId: petId })
    if (!pet)
        return sendError(res, 'Invalid pet Id.', NOT_FOUND);

    // update pet data
    pet = await Pet.findOneAndUpdate({ petId: petId }, data);

    return sendSuccess(res, 'Update successful.');
}

// DELETE: delete pet using pet id
const deletePet = async (req, res) => {
    // getting pet id
    const petId = req.params.petId;

    // check if pet is valid
    let pet = await Pet.findOne({ petId: petId });
    if (!pet)
        return sendError(res, 'Invalid pet Id.', NOT_FOUND);

    // deleting pet using its id
    pet = await Pet.findOneAndDelete({ petId: petId });

    return sendSuccess(res, 'Pet is deleted.');
}

module.exports = {
    createPet,
    getPetById,
    getOwnerId,
    getPetByOwnerId,
    updatePet,
    deletePet
}
