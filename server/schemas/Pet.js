// importing libraries
import mongoose from 'mongoose';

// importing utilities
import { generateUID } from '../utilities/helper.js';

const { Schema } = mongoose;

// pet schema
const petSchema = new Schema({
    UID: {
        type: String,
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
    },
    breed: {
        type: String,
        required: true
    },
    ownerId: {
        type: String,
        required: true
    },
    age: {
        type: String,
        required: true
    },
    weight: {
        type: String,
        required: true
    },
    adoptionRequest: {
        type: Array
    },
    adoptionStatus: {
        type: String,
        default: 'none',
        enum: ['none', 'pending']
    }
},
    {
        timestamps: true
    });

// adding UID to pet instance
petSchema.pre('save', function cb(next) {
    const generatedUID = generateUID(this.name);

    this.UID = generatedUID;

    next();
})

// creating pet model
const Pet = mongoose.model('Pet', petSchema);

export default Pet;