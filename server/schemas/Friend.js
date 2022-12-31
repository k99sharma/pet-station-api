// importing libraries
import { Schema, model } from 'mongoose';

// friend schema
const friendSchema = new Schema({
    UID: {
        type: String,
        required: true
    },
    friends: {
        type: Array
    }
},
{
    timestamps: true
});

// friend model
const friendModel = model('Friend', friendSchema);

export default friendModel;