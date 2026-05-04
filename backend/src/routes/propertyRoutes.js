import express from 'express';
const router = express.Router();
import { createProperty, getProperties } from '../controllers/propertyController.js';
import { protect } from '../middleware/authMiddleware.js';

router.post('/', protect, createProperty);
router.get('/', protect, getProperties);

export default router;
