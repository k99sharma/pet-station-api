// importing libraries
import mongoose from 'mongoose';

const { Schema } = mongoose;

// message schema
const messageSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    from: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: 'true',
        enum: ['sent', 'delivered']
    }
},
    {
        timestamps: true
    })


const Message = mongoose.model('Message', messageSchema);

export default Message;