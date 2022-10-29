// importing modules
const mongoose = require('mongoose')
const Schema = mongoose.Schema;

// adoption request schema
const adoptionRequestSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    requests: {
        type: Array
    }
},
    {
        timestamps: true
    })

// creating model
const adoptionRequestModel = mongoose.model('AdoptionRequest', adoptionRequestSchema);

module.exports = adoptionRequestModel;