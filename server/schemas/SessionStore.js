// importing libraries
import mongoose from 'mongoose';

const { Schema } = mongoose;

// session store schema
const sessionStoreSchema = new Schema({
    sessionID: {
        type: String,
        required: true
    },
    userID: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    }
},
    {
        timestamps: true
    });

const SessionStore = mongoose.model('SessionStore', sessionStoreSchema);

export default SessionStore;