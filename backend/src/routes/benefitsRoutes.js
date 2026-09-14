import express from 'express';
import {
  checkEligibility,
  applyScheme,
  getSchemes,
  getSchemeById,
} from '../controllers/benefitsController.js';

const router = express.Router();

// 1. Schemes Catalog
router.get('/schemes', getSchemes);
router.get('/schemes/:id', getSchemeById);

// 2. Eligibility & Application
router.post('/schemes/:id/check-eligibility', checkEligibility);
router.post('/schemes/:id/apply', applyScheme);

export default router;
