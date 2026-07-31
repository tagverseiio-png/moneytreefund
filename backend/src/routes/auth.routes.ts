import { Router } from 'express';
import { getMe, login, logout, signup, forgotPassword } from '../controllers/auth.controller';
import { verifyToken } from '../middleware/auth';

const router = Router();

// Auth routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);

// Get current user profile and role
router.get('/me', verifyToken, getMe);

export default router;
