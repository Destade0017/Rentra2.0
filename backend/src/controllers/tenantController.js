import Tenant from '../models/Tenant.js';
import Property from '../models/Property.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

// @desc    Add a tenant to a property
// @route   POST /api/tenants
// @access  Private
export const addTenant = asyncHandler(async (req, res) => {
    const { name, email, property: propertyId, rentAmount, dueDate } = req.body;
    const normalizedEmail = email?.toLowerCase().trim();

    // Field validation
    if (!name || !normalizedEmail || !propertyId || !rentAmount || !dueDate) {
        res.status(400);
        throw new Error('Please provide all tenant fields');
    }

    // Check if property exists and belongs to the logged-in user
    const property = await Property.findOne({ _id: propertyId, landlord: req.user._id });

    if (!property) {
        res.status(404);
        throw new Error('Property not found or access denied');
    }

    const tenant = await Tenant.create({
        name,
        email: normalizedEmail,
        property: propertyId,
        rentAmount,
        dueDate,
        status: 'pending',
        profileImage: req.body.profileImage || ''
    });

    res.status(201).json({
        success: true,
        message: 'Tenant added successfully',
        data: tenant
    });
});

// @desc    Get all tenants for a specific property
// @route   GET /api/tenants/:propertyId
// @access  Private
export const getTenantsByProperty = asyncHandler(async (req, res) => {
    const { propertyId } = req.params;

    // Verify property ownership first
    const property = await Property.findOne({ _id: propertyId, landlord: req.user._id });

    if (!property) {
        res.status(404);
        throw new Error('Property not found or access denied');
    }

    const tenants = await Tenant.find({ property: propertyId }).sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        message: 'Tenants retrieved successfully',
        data: tenants
    });
});

// @desc    Get all tenants for all properties of the landlord
// @route   GET /api/tenants
// @access  Private
export const getAllTenants = asyncHandler(async (req, res) => {
    // First find all properties belonging to the landlord
    const properties = await Property.find({ landlord: req.user._id });
    const propertyIds = properties.map(p => p._id);

    // Then find all tenants belonging to those properties
    const tenants = await Tenant.find({ property: { $in: propertyIds } }).sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        message: 'All tenants retrieved successfully',
        data: tenants
    });
});

// @desc    Update a tenant's payment status
// @route   PATCH /api/tenants/:id/status
// @access  Private
export const updateTenantStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const validStatuses = ['paid', 'unpaid', 'pending'];

    if (!status || !validStatuses.includes(status)) {
        res.status(400);
        throw new Error(`Status must be one of: ${validStatuses.join(', ')}`);
    }

    // Verify ownership via the property's landlord field
    const tenant = await Tenant.findById(req.params.id).populate('property');
    if (!tenant) {
        res.status(404);
        throw new Error('Tenant not found');
    }

    if (String(tenant.property?.landlord) !== String(req.user._id)) {
        res.status(403);
        throw new Error('Access denied');
    }

    tenant.status = status;
    await tenant.save();

    res.status(200).json({
        success: true,
        message: 'Payment status updated',
        data: tenant
    });
});
