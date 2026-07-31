import { Router } from 'express';
import { getMe } from '../controllers/auth.controller';
import { verifyToken } from '../middleware/auth';

const router = Router();

// Get current user profile and role
router.get('/me', verifyToken, getMe);

export default router;
