// importing modules
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// login detail schema
const loginDetailSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    clientMachineInformation: {
        type: Object,
        required: true
    },
    lastLogin: {
        type: Date,
        default: Date.now,
        required: true
    },
    lastFailedCount: {
        type: String,
        default: 0,
        required: true
    },
    lastFailedLogin: {
        type: Date,
    },
    lastPasswordUpdate: {
        type: Date,
        default: Date.now,
        required: true
    }
},{
    timestamps: true
});


// login detail model
const loginDetail = mongoose.model('LoginDetail', loginDetailSchema);

module.exports = loginDetail;      // exporting model

