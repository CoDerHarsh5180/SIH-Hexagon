import express from 'express';
import {
  getPublicMetrics,
  getMonthlyVelocity,
  getDepartmentMatrix,
  getDistrictMatrix,
} from '../controllers/dashboardController.js';

const router = express.Router();

// 1. Overall consolidated public statistics & KPIs
router.get('/public', getPublicMetrics);

// 2. Monthly review velocity & turnaround trend
router.get('/monthly-velocity', getMonthlyVelocity);

// 3. Departmental clearance matrix
router.get('/department-matrix', getDepartmentMatrix);

// 4. District-level industrial throughput matrix
router.get('/district-matrix', getDistrictMatrix);

export default router;
