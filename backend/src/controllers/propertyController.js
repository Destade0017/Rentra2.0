const Property = require('../models/Property');
const { asyncHandler } = require('../middleware/errorMiddleware');

// @desc    Create a new property
// @route   POST /api/properties
// @access  Private
const createProperty = asyncHandler(async (req, res) => {
    const { name, address } = req.body;

    if (!name || !address) {
        res.status(400);
        throw new Error('Please provide property name and address');
    }

    const property = await Property.create({
        name,
        address,
        landlord: req.user._id,
        images: req.body.images || []
    });

    res.status(201).json({
        success: true,
        message: 'Property created successfully',
        data: property
    });
});

// @desc    Get all properties for logged-in landlord
// @route   GET /api/properties
// @access  Private
const getProperties = asyncHandler(async (req, res) => {
    const properties = await Property.find({ landlord: req.user._id });

    res.status(200).json({
        success: true,
        message: 'Properties retrieved successfully',
        data: properties
    });
});

module.exports = {
    createProperty,
    getProperties
};
