// importing modules
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// login detail schema
const loginDetailSchema = new Schema({
    lastLogin: {
        type: Date,
        default: Date.now,
        required: true
    },
    lastFailedCount: {
        type: Number,
        default: 0,
        required: true
    },
    lastFailedLogin: {
        type: Date
    },
    lastPasswordUpdate: {
        type: Date,
        default: Date.now,
        required: true
    },
    timestamp: true
});


// login detail model
const loginDetail = mongoose.model('LoginDetail', loginDetailSchema);

module.exports = loginDetail;      // exporting model

