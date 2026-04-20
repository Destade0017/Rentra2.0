const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a tenant name'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please add a tenant email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property',
        required: true
    },
    rentAmount: {
        type: Number,
        required: [true, 'Please add a rent amount']
    },
    dueDate: {
        type: Date,
        required: [true, 'Please add a due date']
    },
    status: {
        type: String,
        enum: ['paid', 'unpaid', 'pending'],
        default: 'pending'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Tenant', tenantSchema);
