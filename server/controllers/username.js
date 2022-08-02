// importing model
const Username = require('../models/Username')

// importing error handlers
const { sendSuccess, sendError } = require('../utils/errorHelper')

// importing status codes
const { CONFLICT, NOT_FOUND } = require('../utils/statusCodes')

// importing helper functions
const { encrypt, decrypt } = require('../utils/helper')

// GET: check if username exists
const checkUsername = async (req, res) => {
    const username = req.query.username

    const isAvailable = await Username.findOne({ username: username }).lean()

    if (isAvailable) return sendError(res, 'Username not available.', CONFLICT)

    return sendSuccess(res, 'Username available.')
}

// PUT: change username
const changeUsername = async (req, res) => {
    const userId = req.user.userId
    const newUsername = req.body.username

    // check if user exists
    const user = await Username.findOne({ userId: userId }).lean()
    if (!user) return sendError(res, 'Invalid user.', NOT_FOUND)

    // update username to new one
    await Username.findOneAndUpdate(
        { userId: userId },
        { username: newUsername }
    )

    return sendSuccess(res, 'Username updated.')
}

// GET: get usernames using limit and cursor
const getAllUsernames = async (req, res) => {
    // get all the query parameter
    const limit = parseInt(req.query.limit) // convert into Number
    const cursor = req.query.cursor

    let usernameCollection // store query result

    // if cursor is present
    if (cursor) {
        // decrypt the cursor using decryption function
        const decryptedCursor = decrypt(cursor)

        // convert decrypted value into date format
        const decryptedDate = new Date(decryptedCursor * 1000)

        // query for users according to cursor
        usernameCollection = await Username.find({
            createdAt: {
                $lt: decryptedDate,
            },
        })
            .sort({ createdAt: -1 }) // descending order
            .limit(limit + 1) // getting +1 of what we need
    } else {
        // if cursor is not present
        usernameCollection = await Username.find({})
            .sort({ createdAt: -1 })
            .limit(limit + 1)
    }

    // checking if there are more documents
    const hasMore = usernameCollection.length === limit + 1
    let nextCursor = null

    // if limit is reached
    if (hasMore) {
        // getting last record from query result
        // needed to find nextCursor and send it in response
        const nextCursorRecord = usernameCollection[limit]

        var unixTimestamp = Math.floor(
            nextCursorRecord.createdAt.getTime() / 1000
        )

        // encrypt cursor
        nextCursor = encrypt(unixTimestamp.toString())

        // removing last record from users data
        usernameCollection.pop()
    }

    // sending response
    return sendSuccess(res, {
        data: usernameCollection,
        paging: {
            hasMore,
            nextCursor,
        },
    })
}

module.exports = {
    checkUsername,
    changeUsername,
    getAllUsernames,
}
