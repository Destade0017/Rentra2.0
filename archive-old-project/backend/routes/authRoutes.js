import express from 'express';
const router = express.Router();
import { 
    register, 
    login, 
    getMe, 
    forgotPassword, 
    resetPassword,
    updateProfile,
    updatePreferences,
    changePassword
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.put('/profile', protect, updateProfile);
router.put('/preferences', protect, updatePreferences);
router.put('/change-password', protect, changePassword);

export default router;
