// importing libraries
import mongoose from 'mongoose';

const { Schema } = mongoose;

// adoption schema
const adoptionSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    contract: {
        type: String,
        required: true
    },
    dateOfAdoption: {
        type: Date,
        default: new Date()
    }
},
    {
        timestamps: true
    });


// adoption model
const Adoption = mongoose.model('Adoption', adoptionSchema);

export default Adoption;