import express from 'express';
import multer from 'multer';
import {
  uploadCertificate,
  renewDocument,
  getVaultDocuments,
  getPendingDocuments,
  getVaultDocumentById,
  downloadCertificate,
} from '../controllers/vaultController.js';

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

const router = express.Router();

// 1. Upload & Renew
router.post('/documents/upload', upload.single('file'), uploadCertificate);
router.post('/documents/:id/renew', renewDocument);

// 2. Retrieval & Download
router.get('/documents', getVaultDocuments);
router.get('/pending-docs', getPendingDocuments);
router.get('/documents/:id', getVaultDocumentById);
router.get('/documents/:id/download', downloadCertificate);

export default router;
