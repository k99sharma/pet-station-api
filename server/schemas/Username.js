// importing libraries
import mongoose from 'mongoose';

const { Schema } = mongoose;

// username schema
const usernameSchema = new Schema({
    UID: {
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
    }
);

// username model
const Username = mongoose.model('Username', usernameSchema);

export default Username;