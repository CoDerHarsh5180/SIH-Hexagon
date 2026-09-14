import express from 'express';
import {
  publicLookup,
  escalateSla,
  getTrackingPipeline,
  getAuditHistory,
} from '../controllers/trackingController.js';

const router = express.Router();

// 1. Public Lookup
router.post('/public-lookup', publicLookup);

// 2. SLA Escalation
router.post('/:id/escalate', escalateSla);

// 3. Pipeline & Audit
router.get('/:id', getTrackingPipeline);
router.get('/:id/history', getAuditHistory);

export default router;
