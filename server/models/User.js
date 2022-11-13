// importing modules
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// importing constant config values
const { JWT_PRIVATE_KEY } = require('../configs/index')

// importing utility functions
const HELPER = require('../utils/model/user')

// user schema
const userSchema = new Schema(
    {
        userId: {
            type: String,
        },
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        username: {
            type: Schema.Types.ObjectId,
            ref: 'Username',
        },
        imageUrl: {
            type: String,
        },
        gender: {
            type: String,
            required: true,
            enum: ['male', 'female', 'others'],
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        admin: {
            type: Boolean,
            default: false,
            required: true,
        },
        active: {
            type: Boolean,
            default: true,
            required: true,
        },
        address: {
            street: {
                type: String,
                required: true,
            },
            region: {
                type: String,
                required: true,
            },
            country: {
                type: String,
                required: true,
            },
            postalZip: {
                type: String,
                required: true,
            },
        },
        loginDetails: {
            type: Schema.Types.ObjectId,
            ref: 'LoginDetail',
        },
    },
    {
        timestamps: true,
    }
)

// function to set userId
userSchema.pre('save', function (next) {
    this.firstName = String(this.firstName).toLowerCase()
    this.lastName = String(this.lastName).toLowerCase()

    // generating user id
    const userId = HELPER.uniqueIdGenerator(this.firstName, this.lastName)

    this.userId = userId // setting userId

    next()
})

// function to set password
userSchema.pre('save', async function (next) {
    this.firstName = String(this.firstName).toLowerCase()
    this.lastName = String(this.lastName).toLowerCase()

    // if password is already modified go to next
    if (!this.isModified('password')) return next()

    const salt = await bcrypt.genSalt(10) // generating salt
    const hash = await bcrypt.hash(this.password, salt) // generating hash

    this.password = hash // setting password to hash

    next()
})

// function to set username
const Username = require('../models/Username') // username model

userSchema.pre('save', async function (next) {
    this.firstName = String(this.firstName).toLowerCase()

    // generate username
    const username = HELPER.usernameGenerator(this.firstName)

    // creating new username model
    let newUsername = new Username({
        username: username,
        userId: this.userId,
    })

    // save username
    newUsername = await newUsername.save()

    this.username = newUsername._id

    next()
})

// method to check if password is valid
userSchema.methods.isValidPassword = async function (userPassword) {
    try {
        return await bcrypt.compare(userPassword, this.password)
    } catch (error) {
        throw new Error(error)
    }
}

// method to generate authentication token
userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign(
        {
            userId: this.userId,
            email: this.email,
            role: this.admin ? 'admin' : 'notAdmin',
            expiredIn: '7 days',
            aud: this.admin ? 'admin' : 'user',
            sub: 'authentication token',
        },
        JWT_PRIVATE_KEY
    )

    return token
}

// user model
const User = mongoose.model('User', userSchema)

module.exports = User // exporting User model
