import { Router } from 'express';
import multer from 'multer';
import { verifyToken } from '../middleware/auth';
import { getDocuments, uploadDocument, getDownloadUrl, deleteDocument } from '../controllers/document.controller';

const router = Router();

// Configure multer to store files in memory before uploading to S3
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  }
});

// All document routes require authentication
router.use(verifyToken);

// CRUD routes
router.get('/', getDocuments);
router.post('/', upload.single('file'), uploadDocument);
router.get('/:id/url', getDownloadUrl);
router.delete('/:id', deleteDocument);

export default router;
