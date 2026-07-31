import { Router } from 'express';
import { createClient, getClients, approveClient, getClientRequests, createDocumentRequest, getPasswordResets, changePassword } from '../controllers/client.controller';
import { verifyToken, requireRole } from '../middleware/auth';

const router = Router();

// Password Reset Requests (Admin only)
router.get('/password-resets', verifyToken, requireRole(['Admin', 'Super Admin', 'Administrator']), getPasswordResets);

// Admin can create clients directly
router.post('/', verifyToken, requireRole(['Admin', 'Super Admin', 'Administrator']), createClient);

// View clients
router.get('/', verifyToken, getClients);

// Approve a client
router.put('/:id/approve', verifyToken, requireRole(['Admin', 'Super Admin', 'Administrator']), approveClient);

// Change client password
router.put('/:id/password', verifyToken, requireRole(['Admin', 'Super Admin', 'Administrator']), changePassword);

// Document requests
router.get('/:id/requests', verifyToken, getClientRequests);
router.post('/:id/requests', verifyToken, requireRole(['Admin', 'Super Admin', 'Administrator']), createDocumentRequest);

export default router;
