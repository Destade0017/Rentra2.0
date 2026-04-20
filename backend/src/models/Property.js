const mongoose = require('mongoose');

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
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Property', propertySchema);
