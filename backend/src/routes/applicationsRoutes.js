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

const router = express.Router();

// 1. Submit Standard / List of Approvals Application
router.post('/', submitApplication);

// 2. Custom Clearances Application
router.post('/custom-apply', submitCustomApplication);

// 3. Discrepancy Clarification Response
router.post('/:id/discrepancy-response', respondDiscrepancy);

// 4. Fee Payment with UTR
router.post('/:id/fee-payment', submitFeePayment);

// 5. Withdraw Application
router.post('/:id/withdraw', withdrawApplication);

// 6. List & Detail
router.get('/', getUserApplications);
router.get('/:id', getApplicationById);

export default router;
