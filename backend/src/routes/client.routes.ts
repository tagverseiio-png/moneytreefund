import { Router } from 'express';
import { createClient, getClients } from '../controllers/client.controller';
import { verifyToken, requireRole } from '../middleware/auth';

const router = Router();

// Only Super Admin and Administrator can create clients
router.post('/', verifyToken, requireRole(['Super Admin', 'Administrator']), createClient);

// Trust Managers and above can view clients
router.get('/', verifyToken, requireRole(['Super Admin', 'Administrator', 'Trust Manager', 'Operations']), getClients);

export default router;
