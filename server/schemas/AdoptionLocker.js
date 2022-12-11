// importing libraries
import mongoose from 'mongoose';

const { Schema } = mongoose;

// adoption locker schema
const adoptionLockerSchema = new Schema({
    ownerId: {
        type: String,
        required: true
    },
    petId: {
        type: String,
        required: true
    }
},
    {
        timestamps: true
    });

// adoption locker model
const AdoptionLocker = mongoose.model('AdoptionLocker', adoptionLockerSchema);

export default AdoptionLocker;