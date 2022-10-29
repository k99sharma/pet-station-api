// importing modules
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// adoption session schema
const adoptionSessionSchema = new Schema({
    userId: {
        type: String,
        required: true
    }
},
    {
        timestamps: true
    })

// adoption session model
const AdoptionSessionModel = mongoose.model('AdoptionSession', adoptionSessionSchema);

module.exports = AdoptionSessionModel;  // exporting model
