// importing libraries
import mongoose from 'mongoose';

// importing utilities
import { generateUID } from '../utilities/helper.js';

const { Schema } = mongoose;

// pet locker schema
const petLockerSchema = new Schema({
    UID: {
        type: String
    },
    userId: {
        type: String,
        required: true
    },
    locker: {
        type: [String]
    }
},
    {
        timestamps: true
    });

// adding UID
petLockerSchema.pre('save', function cb(next) {
    const key = `locker${this.userId}`;

    const generatedUID = generateUID(key);

    this.UID = generatedUID;

    next();
});

// pet locker model
const PetLocker = mongoose.model('petLocker', petLockerSchema);

export default PetLocker;