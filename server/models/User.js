// importing modules
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// user schema
const userSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
        enum: ['male', 'female', 'others']
    },
    email: {
        type: String,
        required: true
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
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        },
        zipCode: {
            type: String,
            required: true
        }
    },
    loginDetails: {
        type: [Schema.Types.ObjectId],
        ref: 'LoginDetail'
    },
    timestamp: true
});

// TODO: function to set userId
// TODO: function to set password
// TODO: function to check if password is valid
// TODO: function to generate auth token

// user model
const User = mongoose.model('User', userSchema);

module.exports = User;      // exporting User model