import Property from '../models/Property.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

// @desc    Create a new property
// @route   POST /api/properties
// @access  Private
export const createProperty = asyncHandler(async (req, res) => {
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
export const getProperties = asyncHandler(async (req, res) => {
    const properties = await Property.find({ landlord: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        message: 'Properties retrieved successfully',
        data: properties
    });
});
