import Property from '../models/Property.js';
import Tenant from '../models/Tenant.js';
import Payment from '../models/Payment.js';
import Complaint from '../models/Complaint.js';

// @desc    Load demo data
// @route   POST /api/demo/load
// @access  Private/Landlord
export const loadDemoData = async (req, res, next) => {
    try {
        const userId = req.user.id;

        // 1. Create Properties
        const propertiesData = [
            { name: 'Sunset Apartments', address: '123 Sunset Blvd', type: 'Apartment', rent: 1500000, status: 'occupied', isDemo: true, landlord: userId },
            { name: 'Oceanview Complex', address: '456 Ocean Drive', type: 'Apartment', rent: 2000000, status: 'occupied', isDemo: true, landlord: userId },
            { name: 'Downtown Loft', address: '789 City Center', type: 'Apartment', rent: 1800000, status: 'vacant', isDemo: true, landlord: userId }
        ];
        const properties = await Property.insertMany(propertiesData);

        // 2. Create Tenants
        const tenantsData = [
            { name: 'Sarah Johnson', phone: '08012345678', email: 'sarah@demo.com', unit: 'A1', rent: 1500000, rentStatus: 'paid', balance: 0, property: properties[0]._id, isDemo: true, landlord: userId, nextRentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
            { name: 'Michael Chen', phone: '08087654321', email: 'michael@demo.com', unit: 'A2', rent: 1500000, rentStatus: 'paid', balance: 0, property: properties[0]._id, isDemo: true, landlord: userId, nextRentDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) },
            { name: 'Emma Davis', phone: '08123456789', email: 'emma@demo.com', unit: 'B1', rent: 2000000, rentStatus: 'due', balance: 2000000, property: properties[1]._id, isDemo: true, landlord: userId, nextRentDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
            { name: 'James Wilson', phone: '08198765432', email: 'james@demo.com', unit: 'B2', rent: 2000000, rentStatus: 'overdue', balance: 4000000, property: properties[1]._id, isDemo: true, landlord: userId, nextRentDate: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000) }
        ];
        const tenants = await Tenant.insertMany(tenantsData);

        // 3. Create Payments
        const paymentsData = [
            { landlord: userId, tenant: tenants[0]._id, property: properties[0]._id, amount: 1500000, method: 'Bank Transfer', status: 'Paid', paymentDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), notes: 'On time payment', isDemo: true },
            { landlord: userId, tenant: tenants[1]._id, property: properties[0]._id, amount: 1500000, method: 'Card Payment', status: 'Paid', paymentDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), notes: 'Auto deduction', isDemo: true },
            { landlord: userId, tenant: tenants[2]._id, property: properties[1]._id, amount: 1000000, method: 'Cash', status: 'Pending', paymentDate: new Date(), notes: 'Partial payment promise', isDemo: true }
        ];
        await Payment.insertMany(paymentsData);
        
        // 4. Create Complaints
        const complaintsData = [
            { landlord: userId, tenant: tenants[2]._id, property: properties[1]._id, title: 'Leaking Faucet', description: 'The kitchen sink is dripping continuously', category: 'Plumbing', priority: 'Low', status: 'new', unit: 'B1', isDemo: true }
        ];
        await Complaint.insertMany(complaintsData);

        res.status(200).json({
            success: true,
            message: 'Demo data loaded successfully'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Clear demo data
// @route   POST /api/demo/clear
// @access  Private/Landlord
export const clearDemoData = async (req, res, next) => {
    try {
        const userId = req.user.id;

        await Property.deleteMany({ landlord: userId, isDemo: true });
        await Tenant.deleteMany({ landlord: userId, isDemo: true });
        await Payment.deleteMany({ landlord: userId, isDemo: true });
        await Complaint.deleteMany({ landlord: userId, isDemo: true });

        res.status(200).json({
            success: true,
            message: 'Demo data cleared successfully'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
