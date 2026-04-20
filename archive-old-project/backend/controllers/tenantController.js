import Tenant from '../models/Tenant.js';
import Property from '../models/Property.js';
import Payment from '../models/Payment.js';

// @desc    Add new tenant
// @route   POST /api/tenants
// @access  Private/Landlord
export const addTenant = async (req, res, next) => {
    try {
        const { propertyId, name, email, phone, rent, unit, dueDate, leaseStart, leaseEnd } = req.body;

        // Verify property exists and belongs to this landlord
        const property = await Property.findById(propertyId || req.body.property);
        if (!property) {
            return res.status(404).json({ success: false, message: 'Property not found' });
        }

        if (property.landlord.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to assign tenants to this property',
            });
        }

        const tenant = await Tenant.create({
            name,
            email,
            phone,
            rent,
            unit,
            dueDate,
            leaseStart,
            leaseEnd,
            property: propertyId || req.body.property,
            landlord: req.user.id
        });

        // Update property status
        property.status = 'occupied';
        await property.save();

        res.status(201).json({
            success: true,
            data: tenant,
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Get all tenants for the logged in landlord
// @route   GET /api/tenants
// @access  Private/Landlord
export const getTenants = async (req, res, next) => {
    try {
        const tenants = await Tenant.find({ landlord: req.user.id })
            .populate('property', 'name address')
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            count: tenants.length,
            data: tenants,
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Get single tenant
// @route   GET /api/tenants/:id
// @access  Private/Landlord
export const getTenant = async (req, res, next) => {
    try {
        const tenant = await Tenant.findById(req.params.id).populate('property', 'name address');

        if (!tenant) {
            return res.status(404).json({ success: false, message: 'Tenant not found' });
        }

        if (tenant.landlord.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this tenant',
            });
        }

        res.status(200).json({
            success: true,
            data: tenant,
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Update tenant details
// @route   PUT /api/tenants/:id
// @access  Private/Landlord
export const updateTenant = async (req, res, next) => {
    try {
        let tenant = await Tenant.findById(req.params.id);

        if (!tenant) {
            return res.status(404).json({ success: false, message: 'Tenant not found' });
        }

        if (tenant.landlord.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this tenant',
            });
        }

        tenant = await Tenant.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            success: true,
            data: tenant,
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Delete tenant
// @route   DELETE /api/tenants/:id
// @access  Private/Landlord
export const deleteTenant = async (req, res, next) => {
    try {
        const tenant = await Tenant.findById(req.params.id);

        if (!tenant) {
            return res.status(404).json({ success: false, message: 'Tenant not found' });
        }

        if (tenant.landlord.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this tenant',
            });
        }

        // Reset property status
        const property = await Property.findById(tenant.property);
        if (property) {
            property.status = 'vacant';
            await property.save();
        }

        await tenant.deleteOne();

        res.status(200).json({
            success: true,
            data: {},
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
// @desc    Get dashboard data for the logged in tenant
// @route   GET /api/tenants/me/dashboard
// @access  Private/Tenant
export const getTenantDashboard = async (req, res, next) => {
    try {
        // Find tenant by email (linked to the User)
        const tenant = await Tenant.findOne({ email: req.user.email })
            .populate('property', 'name address city image')
            .populate('landlord', 'name email');

        if (!tenant) {
            return res.status(404).json({ 
                success: false, 
                message: 'No tenant profile associated with this account. Please contact your landlord.' 
            });
        }

        res.status(200).json({
            success: true,
            data: tenant,
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Mark tenant rent as paid
// @route   PUT /api/tenants/:id/pay
// @access  Private/Landlord
export const markRentAsPaid = async (req, res, next) => {
    try {
        const tenant = await Tenant.findById(req.params.id);

        if (!tenant) {
            return res.status(404).json({ success: false, message: 'Tenant not found' });
        }

        if (tenant.landlord.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        // Update tenant status
        tenant.rentStatus = 'paid';
        tenant.balance = 0;
        // Optionally update next rent date (e.g., +1 month)
        if (tenant.nextRentDate) {
            const nextDate = new Date(tenant.nextRentDate);
            nextDate.setMonth(nextDate.getMonth() + 1);
            tenant.nextRentDate = nextDate;
        }
        
        await tenant.save();

        // Create a payment record automatically
        await Payment.create({
            landlord: req.user.id,
            tenant: tenant._id,
            property: tenant.property,
            amount: tenant.rent,
            method: 'Cash', // Default for manual mark as paid
            status: 'Paid',
            notes: 'Manually marked as paid by landlord'
        });

        res.status(200).json({
            success: true,
            data: tenant
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
