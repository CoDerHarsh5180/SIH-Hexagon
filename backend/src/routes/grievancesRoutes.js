import express from 'express';
import {
  submitQuery,
  getUserQueries,
  getQueryById,
  submitComplaint,
  getUserComplaints,
  getComplaintById,
  submitFeedback,
  getFeedbackStats,
} from '../controllers/grievancesController.js';

const router = express.Router();

// 1. Queries
router.post('/queries', submitQuery);
router.get('/queries', getUserQueries);
router.get('/queries/:id', getQueryById);

// 2. Complaints
router.post('/complaints', submitComplaint);
router.get('/complaints', getUserComplaints);
router.get('/complaints/:id', getComplaintById);

// 3. Feedback
router.post('/feedback', submitFeedback);
router.get('/feedback/stats', getFeedbackStats);

export default router;
