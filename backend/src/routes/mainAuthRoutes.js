import express from 'express';
import {
  createMasterDoc,
  updateMasterDoc,
  registerLocalAuthority,
  getLocalAuthorities,
  interveneComplaint,
  getStateComplaints,
  approveCentralRequest,
  rejectCentralRequest,
  getCentralRequests,
  getCentralRequestById,
  getMasterCatalog,
  getMasterDocById,
  getAnalytics,
} from '../controllers/mainAuthController.js';

const router = express.Router();

// 1. Analytics & Master Catalog
router.get('/analytics', getAnalytics);
router.get('/catalog', getMasterCatalog);
router.get('/catalog/:id', getMasterDocById);

// 2. Create & Update Master Doc (Clearance or Scheme)
router.post('/create-doc', createMasterDoc);
router.put('/catalog/:id', updateMasterDoc);

// 3. Local Authorities Directory
router.get('/local-authorities', getLocalAuthorities);
router.post('/local-authorities', registerLocalAuthority);

// 4. Complaints & Interventions
router.get('/complaints', getStateComplaints);
router.post('/complaints/:id/intervene', interveneComplaint);

// 5. Central Requests Review & Sanctions
router.get('/requests', getCentralRequests);
router.get('/requests/:id', getCentralRequestById);
router.post('/requests/:id/approve', approveCentralRequest);
router.post('/requests/:id/reject', rejectCentralRequest);

export default router;
