import express from 'express';
const router = express.Router();
import { loadDemoData, clearDemoData } from '../controllers/demoController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

router.use(protect);
router.use(authorize('landlord'));

router.post('/load', loadDemoData);
router.post('/clear', clearDemoData);

export default router;
