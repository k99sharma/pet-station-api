// importing libraries
import mongoose from 'mongoose';

const { Schema } = mongoose;

// friend schema
const friendsSchema = new Schema({
    userName: {
        type: String,
        required: true
    },
    friends: {
        type: [String]
    }
},
    {
        timestamps: true
    });

const Friends = mongoose.model('Friend', friendsSchema);

export default Friends;