import express from 'express';
const router = express.Router();
import { registerUser, loginUser, getMe } from '../controllers/authController.js';
import { googleAuth } from '../controllers/googleAuthController.js';
import { protect } from '../middleware/authMiddleware.js';

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);

// Google OAuth — additive, does not affect existing routes
router.post('/google', googleAuth);

export default router;
