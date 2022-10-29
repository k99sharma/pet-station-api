// importing modules
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// import schema
const adoptionListSchema = new Schema({
    sessionId: {
        type: String,
        required: true
    },
    petId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pet',
        required: true
    }
},
    {
        timestamps: true
    })

// creating new model
const AdoptionListModel = mongoose.model('AdoptionList', adoptionListSchema);

module.exports = AdoptionListModel;     // exporting model