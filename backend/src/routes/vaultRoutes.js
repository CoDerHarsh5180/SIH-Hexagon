import express from 'express';
import multer from 'multer';
import {
  scanAndUploadDocument,
  confirmDocumentVerification,
  uploadCertificate,
  renewDocument,
  getVaultDocuments,
  getPendingDocuments,
  getVaultDocumentById,
  downloadCertificate,
  getDocumentTypes,
} from '../controllers/vaultController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf')) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF documents are allowed.'), false);
    }
  },
});

const router = express.Router();

// 1. AI Document Scanning & Cloudinary Ingestion
router.post('/documents/scan-and-upload', optionalAuth, upload.single('file'), scanAndUploadDocument);
router.post('/documents/confirm', optionalAuth, confirmDocumentVerification);

// 2. Document Types Catalog (Core + Database Clearances + Prerequisites)
router.get('/document-types', getDocumentTypes);

// 3. Generic Upload & Renew
router.post('/documents/upload', optionalAuth, upload.single('file'), uploadCertificate);
router.post('/documents/:id/renew', optionalAuth, renewDocument);

// 3. Retrieval & Download
router.get('/documents', optionalAuth, getVaultDocuments);
router.get('/pending-docs', optionalAuth, getPendingDocuments);
router.get('/documents/:id', getVaultDocumentById);
router.get('/documents/:id/download', downloadCertificate);

export default router;
