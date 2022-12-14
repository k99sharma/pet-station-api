// importing libraries
import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';

// importing configuration
import CONFIG from '../configs/config.js';

// importing helper functions
import { generateUID } from '../utilities/helper.js';

const { Schema, model } = mongoose;

// user schema
const userSchema = new Schema({
    UID: {
        type: String,
        default: null
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    profilePictureUrl: {
        type: String,
        default: null
    },
    email: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        default: null
    },
    address: {
        street: {
            type: String,
            default: null
        },
        city: {
            type: String,
            default: null
        },
        state: {
            type: String,
            default: null
        },
        pinCode: {
            type: String,
            default: null
        }
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        required: true
    },
    password: {
        type: String,
        required: true
    },
    petAdoptionRequest: {
        type: Array
    },
    active: {
        type: Boolean,
        default: true
    },
    privilege: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    }
});

// function to set UID
userSchema.pre('save', function cb(next) {
    const firstName = String(this.firstName).toLowerCase();
    const lastName = String(this.lastName).toLowerCase();

    // generate new UID
    const key = lastName + firstName;
    const generatedUID = generateUID(key);

    this.UID = generatedUID;       // setting UID

    next();
})

// function to set password
userSchema.pre('save', async function cb(next) {
    // if password is already modified go to next
    if (!this.isModified('password')) return next()

    const salt = await bcryptjs.genSalt(10);
    const hash = await bcryptjs.hash(this.password, salt);

    this.password = hash;

    return next();
})

// function to check if password is valid
userSchema.methods.isValidPassword = async function cb(password) {
    try {
        return await bcryptjs.compare(password, this.password)
    } catch (error) {
        throw new Error(error)
    }
}

// function to generate authentication token
userSchema.methods.generateAuthToken = function cb() {
    const token = jsonwebtoken.sign({
        userId: this.UID,
        email: this.email,
        role: this.privilege,
        aud: this.privilege,
        sub: 'authentication token'
    },
        CONFIG.JWT_PRIVATE_KEY
    )

    return token;
}

// user model
const userModel = model('User', userSchema);

export default userModel;