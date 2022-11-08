// importing modules
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adoptionRecordSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    pet: {
        type: {},
        required: true
    },
    adoptionDate: {
        type: Date,
        default: Date.now()
    }
},
    {
        timestamps: true
    });

// create model
const AdoptionRecord = mongoose.model('AdoptionRecord', adoptionRecordSchema);

module.exports = AdoptionRecord;