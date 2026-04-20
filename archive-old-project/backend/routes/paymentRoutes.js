import express from 'express';
const router = express.Router();
import {
    recordPayment,
    getPayments,
    getPaymentStats,
    getTenantPayments,
    getMyPayments
} from '../controllers/paymentController.js';

import { protect, authorize } from '../middleware/authMiddleware.js';

router.use(protect);

router.get('/me', authorize('tenant'), getMyPayments);

router
    .route('/')
    .get(authorize('landlord'), getPayments)
    .post(authorize('landlord'), recordPayment);

router.get('/stats/summary', authorize('landlord'), getPaymentStats);
router.get('/tenant/:tenantId', authorize('landlord'), getTenantPayments);

export default router;
