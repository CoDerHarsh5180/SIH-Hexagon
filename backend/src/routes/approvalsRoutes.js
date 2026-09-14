import express from 'express';
import {
  evaluateQuestionnaire,
  calculateFees,
  getRequiredDocuments,
  getApprovalsCatalog,
  getApprovalById,
} from '../controllers/approvalsController.js';

const router = express.Router();

// 1. Questionnaire Evaluation
router.post('/evaluate', evaluateQuestionnaire);

// 2. Statutory Fee Calculator
router.post('/calculator', calculateFees);

// 3. Required Documents Consolidator
router.post('/required-documents', getRequiredDocuments);

// 4. Catalog List & Detail
router.get('/', getApprovalsCatalog);
router.get('/:id', getApprovalById);

export default router;
