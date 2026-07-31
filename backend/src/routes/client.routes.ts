import { Router } from 'express';
import { createClient, getClients, approveClient, getClientRequests, createDocumentRequest } from '../controllers/client.controller';
import { verifyToken, requireRole } from '../middleware/auth';

const router = Router();

// Admin can create clients directly
router.post('/', verifyToken, requireRole(['Admin', 'Super Admin', 'Administrator']), createClient);

// View clients
router.get('/', verifyToken, getClients);

// Approve a client
router.put('/:id/approve', verifyToken, requireRole(['Admin', 'Super Admin', 'Administrator']), approveClient);

// Document requests
router.get('/:id/requests', verifyToken, getClientRequests);
router.post('/:id/requests', verifyToken, requireRole(['Admin', 'Super Admin', 'Administrator']), createDocumentRequest);

export default router;
