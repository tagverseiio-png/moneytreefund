import { Router } from 'express';
import { getLayouts, createLayout, updateLayout, deleteLayout } from '../controllers/settings.controller';
import { verifyToken, requireRole } from '../middleware/auth';

const router = Router();

// Layouts can be viewed by anyone logged in (so clients can fetch them on signup? Wait, signup is public)
// If signup is public, we need a public route to fetch layouts.
router.get('/layouts/public', getLayouts); // Public endpoint for signup page

router.get('/layouts', verifyToken, getLayouts);

// Only Admins can modify layouts
router.post('/layouts', verifyToken, requireRole(['Admin', 'Super Admin', 'Administrator']), createLayout);
router.put('/layouts/:id', verifyToken, requireRole(['Admin', 'Super Admin', 'Administrator']), updateLayout);
router.delete('/layouts/:id', verifyToken, requireRole(['Admin', 'Super Admin', 'Administrator']), deleteLayout);

export default router;
