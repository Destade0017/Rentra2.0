import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a property name'],
        trim: true
    },
    address: {
        type: String,
        required: [true, 'Please add a property address'],
        trim: true
    },
    landlord: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    images: [{
        type: String,
        default: []
    }]
}, {
    timestamps: true
});

export default mongoose.model('Property', propertySchema);
