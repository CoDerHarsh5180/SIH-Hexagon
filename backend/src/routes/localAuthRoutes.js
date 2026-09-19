import express from 'express';
import {
  submitScrutinyDecision,
  scheduleInspection,
  submitInspectionReport,
  resolveComplaint,
  getInwardRequests,
  getRequestDossier,
  getHistory,
} from '../controllers/localAuthController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// All local-auth routes require authentication and LOCAL_AUTH/MAIN_AUTH/ADMIN role
router.use(protect, authorizeRoles('LOCAL_AUTH', 'MAIN_AUTH', 'ADMIN'));

// 1. Inward Requests & History
router.get('/requests', getInwardRequests);
router.get('/requests/:id', getRequestDossier);
router.get('/history', getHistory);

// 2. Scrutiny Decision
router.post('/requests/:id/scrutiny', submitScrutinyDecision);

// 3. Field Inspection
router.post('/requests/:id/schedule-inspection', scheduleInspection);
router.post('/requests/:id/inspection-report', submitInspectionReport);

// 4. Resolve Grievances
router.post('/complaints/:id/resolve', resolveComplaint);

export default router;
