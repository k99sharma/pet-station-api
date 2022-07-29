// importing model
const User = require('../models/User');

// importing error handlers
const {
    sendSuccess,
    sendError
} = require('../utils/errorHelper');


// importing status codes
const {
    CONFLICT, NOT_FOUND, UPDATED, BAD_REQUEST
} = require('../utils/statusCodes');


// importing helper function

// POST: create a new user
const createUser = async (req, res) => {
    const {
        firstName, lastName,
        gender,
        email,
        password,
        street, region, country, postalZip
    } = req.body;

    // if user exists do not create new user
    let user = await User.findOne({
        email: email
    });

    if (user)
        return sendError(res, 'User already exists.', CONFLICT);

    // creating new user model
    const newUser = new User({
        firstName: firstName.toLowerCase(),
        lastName: lastName.toLowerCase(),
        gender: gender.toLowerCase(),
        email: email,
        password: password.toLowerCase(),
        address: {
            street: street.toLowerCase(),
            region: region.toLowerCase(),
            country: country.toLowerCase(),
            postalZip: postalZip.toLowerCase()
        }
    });

    // save user in database
    await newUser.save();

    return sendSuccess(res, 'User successfully created.');
}

// GET: get user using email address
// user(userId, firstName, lastName, username, gender, email, address)

const getUserByEmail = async (req, res) => {
    // getting email from query
    const email = req.query.email;

    // finding user
    const user = await User.findOne({ email: email }).populate('username');
    if (!user || !user.active)
        return sendError(res, 'Invalid User.', NOT_FOUND);

    // generating data to return back to client
    const data = {
        userId: user.userId,
        username: user.username.username,
        firstName: user.firstName,
        lastName: user.lastName,
        gender: user.gender,
        email: user.email,
        address: user.address
    };

    return sendSuccess(res, data);
}

// GET: get user using userId
// user(userId, firstName, lastName, username, gender, email, address)

const getUserByUserId = async (req, res) => {
    // getting user Id from query
    const userId = req.query.userId;

    // finding user
    const user = await User.findOne({ userId: userId }).populate('username');
    if (!user || !user.active)
        return sendError(res, 'Invalid User.', NOT_FOUND);

    // generating data to return back to client
    const data = {
        userId: user.userId,
        username: user.username.username,
        firstName: user.firstName,
        lastName: user.lastName,
        gender: user.gender,
        email: user.email,
        address: user.address
    };

    return sendSuccess(res, data);
}

// GET: check if user exists using email address
// returns boolean value

const isUserValid = async (req, res) => {
    const email = req.query.email;

    const user = await User.findOne({ email: email });

    if (!user || !user.active)
        return sendSuccess(res, false, NOT_FOUND);

    return sendSuccess(res, true);
}

// PUT: update user data
// update(first name, last name, address, gender)

const updateUser = async (req, res) => {
    // getting data type and userId
    const { type, userId } = req.params;
    const data = req.body;

    // check if user id is valid
    const user = await User.findOne({ userId: userId });
    if (!user || !user.active)
        return sendError(res, 'Invalid User.', NOT_FOUND);

    let updatedData = {};

    // data based on type
    switch (type) {
        case 'firstName':
            updatedData = { firstName: data.firstName };
            break;

        case 'lastName':
            updatedData = { lastName: data.lastName };
            break;

        case 'address':
            updatedData = { address: data.address };
            break;

        case 'gender':
            updatedData = { address: data.gender };
            break;

        default:
            return sendError(res, 'Invalid type of data.', BAD_REQUEST);
    }

    // if no data is present
    if (Object.keys(data).length == 0)
        return sendError(res, 'Data not found.', BAD_REQUEST);

    // update data
    await User.findOneAndUpdate({ userId: userId }, updatedData);

    return sendSuccess(res, 'Update successful.', UPDATED);
}

// DELETE: delete user using user id

const deleteUser = async (req, res) => {
    // get user id from params
    const userId = req.params.userId;

    // check if user exists
    const user = await User.findOne({ userId: userId });
    if (!user || user.active)
        return sendError(res, 'Invalid User.', NOT_FOUND);

    // make user inactive
    await User.findOneAndUpdate({ userId: userId }, { active: false });

    return sendSuccess(res, 'User deleted.', UPDATED);
}

// GET: get all user using cursor and limit
const getAllUsers = async (req, res) => {
    // get all the query parameter
    const limit = parseInt(req.query.limit);    // convert into Number
    const cursor = req.query.cursor;
 
    let userCollection; // store query result

    // if cursor is present
    if (cursor) {
        // decrypt the cursor using decryption function
        const decryptedCursor = cursor;
        
        // convert decrypted value into date format
        const decryptedDate = new Date(decryptedCursor * 1000);
        
        // query for users according to cursor
        userCollection = await User.find({
            createdAt: {
                $lt: decryptedDate
            },
        })
            .sort({ createdAt: -1 })        // descending order
            .limit(limit + 1)               // getting +1 of what we need
    } 
    else {
        // if cursor is not present 
        userCollection = await User.find({})
            .sort({ createdAt: -1 })
            .limit(limit + 1)
    }

    // checking if there are more documents
    const hasMore = userCollection.length === limit + 1;
    let nextCursor = null;

    // if limit is reached
    if (hasMore) {
        // getting last record from query result
        // needed to find nextCursor and send it in response
        const nextCursorRecord = userCollection[limit];


        var unixTimestamp = Math.floor(nextCursorRecord.createdAt.getTime() / 1000); 
        
        // encrypt cursor 
        nextCursor = unixTimestamp.toString();  

        // removing last record from users data
        userCollection.pop();
    }

    // sending response
    return sendSuccess(res, {
        data: userCollection,
        paging: {
            hasMore,
            nextCursor
        }
    });
}

module.exports = {
    createUser,
    getUserByEmail,
    getUserByUserId,
    getAllUsers,
    isUserValid,
    updateUser,
    deleteUser
};