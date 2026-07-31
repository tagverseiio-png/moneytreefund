import { Router } from 'express';
import { getDashboardStats } from '../controllers/stats.controller';
import { verifyToken, requireRole } from '../middleware/auth';

const router = Router();

router.get('/', verifyToken, requireRole(['Admin', 'Super Admin', 'Administrator']), getDashboardStats);

export default router;
