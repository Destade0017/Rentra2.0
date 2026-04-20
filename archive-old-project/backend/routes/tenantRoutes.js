import express from 'express';
const router = express.Router();
import {
    addTenant,
    getTenants,
    getTenant,
    updateTenant,
    deleteTenant,
    getTenantDashboard,
    markRentAsPaid
} from '../controllers/tenantController.js';

import { protect, authorize } from '../middleware/authMiddleware.js';

router.use(protect);

// Routes accessible by Tenants
router.get('/me/dashboard', getTenantDashboard);

// Routes accessible ONLY by Landlords
router.use(authorize('landlord'));

router
    .route('/')
    .get(getTenants)
    .post(addTenant);

router
    .route('/:id')
    .get(getTenant)
    .put(updateTenant)
    .delete(deleteTenant);

router.put('/:id/pay', markRentAsPaid);

export default router;
