import express from 'express';
const router = express.Router();
import { 
    register, 
    login, 
    getMe, 
    forgotPassword, 
    resetPassword 
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:resettoken', resetPassword);

export default router;
