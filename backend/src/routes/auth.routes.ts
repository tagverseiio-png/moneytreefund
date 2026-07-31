import { Router } from 'express';
import { getMe, login, logout } from '../controllers/auth.controller';
import { verifyToken } from '../middleware/auth';

const router = Router();

// Auth routes
router.post('/login', login);
router.post('/logout', logout);

// Get current user profile and role
router.get('/me', verifyToken, getMe);

export default router;
