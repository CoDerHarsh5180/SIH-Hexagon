import express from 'express';
import {
  submitApplication,
  submitCustomApplication,
  respondDiscrepancy,
  submitFeePayment,
  withdrawApplication,
  getUserApplications,
  getApplicationById,
} from '../controllers/applicationsController.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// 1. Submit Standard / List of Approvals Application
router.post('/', optionalAuth, submitApplication);

// 2. Custom Clearances Application
router.post('/custom-apply', optionalAuth, submitCustomApplication);

// 3. Discrepancy Clarification Response
router.post('/:id/discrepancy-response', optionalAuth, respondDiscrepancy);

// 4. Fee Payment with UTR
router.post('/:id/fee-payment', optionalAuth, submitFeePayment);

// 5. Withdraw Application
router.post('/:id/withdraw', optionalAuth, withdrawApplication);

// 6. List & Detail
router.get('/', optionalAuth, getUserApplications);
router.get('/:id', optionalAuth, getApplicationById);

export default router;
