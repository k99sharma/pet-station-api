// importing modules
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// importing helper functions
const HELPER = require('../utils/model/pet');

// pet schema
const petSchema = new Schema({
    petId: {
        type: String,
    },
    name: {
        type: String,
        required: true
    },
    breed: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    adoptionStatus: {
        type: String,
        default: 'none',
        enum: ['none', 'pending', 'completed']
    },
    ownerId: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
        required: true
    }
},
    {
        timestamps: true
    })


// function to set pet Id
petSchema.pre('save', function (next) {
    const name = this.name.toLowerCase();
    const uniqueId = HELPER.uniqueIdGenerator(name);

    this.petId = uniqueId;

    next();
})

// creating pet model
const Pet = mongoose.model('Pet', petSchema);

module.exports = Pet;       // exporting model