// importing modules
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// username schema
const usernameSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    userId:{
        type: String,
        required: true
    },
},
{
    timestamps: true
});

// creating model
const Username = mongoose.model('Username', usernameSchema);

module.exports = Username;