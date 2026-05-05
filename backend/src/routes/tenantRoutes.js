import express from 'express';
const router = express.Router();
import { addTenant, getTenantsByProperty, getAllTenants, updateTenantStatus } from '../controllers/tenantController.js';
import { protect } from '../middleware/authMiddleware.js';

router.post('/', protect, addTenant);
router.get('/', protect, getAllTenants);
router.get('/:propertyId', protect, getTenantsByProperty);
router.patch('/:id/status', protect, updateTenantStatus);

export default router;

