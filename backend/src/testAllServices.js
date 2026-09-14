import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import connectDB from './config/db.js';
import Application from './models/Application.js';
import Complaint from './models/Complaint.js';
import { seedApprovalsCatalog } from './utils/seedApprovals.js';

let server;

async function runAllTests() {
  console.log('🧪 Starting Full Services (4-10) Test Suite...\n');

  try {
    await connectDB();
    await seedApprovalsCatalog();
  } catch (err) {
    console.warn('[Test DB Warning]', err.message);
  }

  const PORT = 5058;
  server = app.listen(PORT, async () => {
    console.log(`Test server running on port ${PORT}`);
    const base = `http://localhost:${PORT}/api`;

    try {
      // Setup a baseline application for tracking, local-auth, and main-auth tests
      const testApp = await Application.findOneAndUpdate(
        { applicationId: 'APP-MH-2026-89412' },
        {
          applicationId: 'APP-MH-2026-89412',
          verificationCode: '123456',
          approvalId: 'appr-01',
          approvalTitle: 'Consent to Establish (CTE) — Pollution Board',
          authority: 'Maharashtra Pollution Control Board (MPCB)',
          district: 'Pune',
          status: 'SUBMITTED',
          feePaid: 15000,
          submissionDate: new Date('2026-09-12T13:30:00.000Z'),
          sla: {
            slaDays: 30,
            slaDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            isEscalated: false,
            escalations: [],
          },
        },
        { upsert: true, returnDocument: 'after' }
      );

      // ── 4. TRACKING SERVICE ──
      console.log('\n[4.1] Testing POST /api/tracking/public-lookup...');
      const lookupRes = await fetch(`${base}/tracking/public-lookup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId: 'APP-MH-2026-89412',
          verificationCode: '123456',
        }),
      });
      const lookupData = await lookupRes.json();
      console.log('Status:', lookupRes.status, 'Title:', lookupData.data?.approvalTitle);
      if (lookupRes.status !== 200) throw new Error('tracking public-lookup failed');

      console.log('\n[4.2] Testing POST /api/tracking/APP-MH-2026-89412/escalate...');
      const escalateRes = await fetch(`${base}/tracking/APP-MH-2026-89412/escalate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          remarks: 'Clearance duration exceeded statutory timeline.',
        }),
      });
      const escalateData = await escalateRes.json();
      console.log('Status:', escalateRes.status, 'Escalated:', escalateData.data?.sla?.isEscalated);
      if (escalateRes.status !== 200) throw new Error('tracking escalate failed');

      // ── 5. VAULT SERVICE ──
      console.log('\n[5.1] Testing POST /api/vault/documents/upload...');
      const vaultUploadRes = await fetch(`${base}/vault/documents/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentName: '7/12 Land Record',
          category: 'LAND',
        }),
      });
      const vaultUploadData = await vaultUploadRes.json();
      console.log('Status:', vaultUploadRes.status, 'Document Name:', vaultUploadData.data?.documentName, 'ID:', vaultUploadData.data?._id);
      if (vaultUploadRes.status !== 201) throw new Error('vault upload failed');
      const vaultDocId = vaultUploadData.data?._id;

      console.log(`\n[5.2] Testing POST /api/vault/documents/${vaultDocId}/renew...`);
      const vaultRenewRes = await fetch(`${base}/vault/documents/${vaultDocId}/renew`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          utrNumber: '423871928312',
        }),
      });
      const vaultRenewData = await vaultRenewRes.json();
      console.log('Status:', vaultRenewRes.status, 'Status:', vaultRenewData.data?.status, 'Renewal UTR:', vaultRenewData.data?.renewalHistory?.[0]?.utrNumber);
      if (vaultRenewRes.status !== 200) throw new Error('vault renew failed');

      // ── 6. GRIEVANCES SERVICE ──
      console.log('\n[6.1] Testing POST /api/grievances/queries...');
      const queryRes = await fetch(`${base}/grievances/queries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          department: 'Maharashtra Pollution Control Board (MPCB)',
          query: 'Question regarding power load requirement',
          district: 'Chhatrapati Sambhajinagar (Aurangabad)',
        }),
      });
      const queryData = await queryRes.json();
      console.log('Status:', queryRes.status, 'Query ID:', queryData.queryId);
      if (queryRes.status !== 201) throw new Error('grievances query failed');

      console.log('\n[6.2] Testing POST /api/grievances/complaints...');
      const complaintRes = await fetch(`${base}/grievances/complaints`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId: 'APP-MH-2026-89412',
          authority: 'Maharashtra Pollution Control Board (MPCB)',
          complaintType: 'SLA Exceeded / Stalled Review',
          subject: 'Delay in CTE issuance',
          description: 'Submitted all documents 45 days ago, review is stalled.',
        }),
      });
      const complaintData = await complaintRes.json();
      console.log('Status:', complaintRes.status, 'Complaint ID:', complaintData.complaintId);
      if (complaintRes.status !== 201) throw new Error('grievances complaint failed');
      const testComplaintId = complaintData.complaintId;

      console.log('\n[6.3] Testing POST /api/grievances/feedback...');
      const feedbackRes = await fetch(`${base}/grievances/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          department: 'Maharashtra Pollution Control Board (MPCB)',
          rating: 5,
          comments: 'Smooth inspection process',
        }),
      });
      const feedbackData = await feedbackRes.json();
      console.log('Status:', feedbackRes.status, 'Rating Recorded:', feedbackData.data?.rating);
      if (feedbackRes.status !== 201) throw new Error('grievances feedback failed');

      // ── 7. BENEFITS SERVICE ──
      console.log('\n[7.1] Testing POST /api/benefits/schemes/SCHEME-1024/check-eligibility...');
      const eligRes = await fetch(`${base}/benefits/schemes/SCHEME-1024/check-eligibility`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          machineryCostCrores: 4.85,
          powerLoadHp: 350,
        }),
      });
      const eligData = await eligRes.json();
      console.log('Status:', eligRes.status, 'Calculated Subsidy:', `₹${eligData.data?.calculatedSubsidyCrores} Cr`, 'Eligible:', eligData.data?.isEligible);
      if (eligRes.status !== 200) throw new Error('benefits check-eligibility failed');

      console.log('\n[7.2] Testing POST /api/benefits/schemes/SCHEME-1024/apply...');
      const applySchemeRes = await fetch(`${base}/benefits/schemes/SCHEME-1024/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schemeTitle: 'PSI 2019 Capital Subsidy',
          category: 'Capital Incentive',
          claimDate: '2026-09-12T13:30:00.000Z',
        }),
      });
      const applySchemeData = await applySchemeRes.json();
      console.log('Status:', applySchemeRes.status, 'Claim ID:', applySchemeData.claimId);
      if (applySchemeRes.status !== 201) throw new Error('benefits apply failed');

      // ── 8. NOTIFICATIONS SERVICE ──
      console.log('\n[8.1] Testing POST /api/notifications/mark-all-read...');
      const notifRes = await fetch(`${base}/notifications/mark-all-read`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const notifData = await notifRes.json();
      console.log('Status:', notifRes.status, notifData.message);
      if (notifRes.status !== 200) throw new Error('notifications mark-all-read failed');

      // ── 9. LOCAL AUTH SERVICE ──
      console.log('\n[9.1] Testing POST /api/local-auth/requests/APP-MH-2026-89412/schedule-inspection...');
      const schedRes = await fetch(`${base}/local-auth/requests/APP-MH-2026-89412/schedule-inspection`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inspectionDate: '2026-09-24',
          inspectionTime: '11:00 AM',
          inspectorName: 'Anand Patil',
          inspectorContact: '+91 22 2757 4410',
          instructions: 'Ensure site engineer and blueprint are available.',
        }),
      });
      const schedData = await schedRes.json();
      console.log('Status:', schedRes.status, 'Inspector:', schedData.data?.inspection?.inspectorName, 'Scheduled:', schedData.data?.inspection?.scheduledDate);
      if (schedRes.status !== 200) throw new Error('local-auth schedule-inspection failed');

      console.log('\n[9.2] Testing POST /api/local-auth/requests/APP-MH-2026-89412/inspection-report...');
      const repRes = await fetch(`${base}/local-auth/requests/APP-MH-2026-89412/inspection-report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inspectionDate: '2026-09-24',
          inspectorName: 'Anand Patil',
          findings: 'All safety equipment verified',
          status: 'PASSED',
        }),
      });
      const repData = await repRes.json();
      console.log('Status:', repRes.status, 'Inspection Status:', repData.data?.inspection?.report?.status);
      if (repRes.status !== 200) throw new Error('local-auth inspection-report failed');

      console.log('\n[9.3] Testing POST /api/local-auth/requests/APP-MH-2026-89412/scrutiny (APPROVING)...');
      const scrutinyRes = await fetch(`${base}/local-auth/requests/APP-MH-2026-89412/scrutiny`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decision: 'APPROVED',
          signedDocId: 'DSC-TOKEN-AUR-8821',
        }),
      });
      const scrutinyData = await scrutinyRes.json();
      console.log('Status:', scrutinyRes.status, 'Decision:', scrutinyData.data?.scrutiny?.decision, 'DSC Token:', scrutinyData.data?.scrutiny?.signedDocId);
      if (scrutinyRes.status !== 200) throw new Error('local-auth scrutiny failed');

      console.log(`\n[9.4] Testing POST /api/local-auth/complaints/${testComplaintId}/resolve...`);
      const resolveCompRes = await fetch(`${base}/local-auth/complaints/${testComplaintId}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resolutionText: 'Site inspection completed, file cleared.',
          status: 'RESOLVED_WITH_INSPECTION',
        }),
      });
      const resolveCompData = await resolveCompRes.json();
      console.log('Status:', resolveCompRes.status, 'Status:', resolveCompData.data?.status, 'Resolution:', resolveCompData.data?.resolution?.resolutionText);
      if (resolveCompRes.status !== 200) throw new Error('local-auth resolve complaint failed');

      // ── 10. MAIN AUTH SERVICE ──
      console.log('\n[10.1] Testing POST /api/main-auth/create-doc (Clearance Docket)...');
      const createClearanceRes = await fetch(`${base}/main-auth/create-doc`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: 'DOC-AUTH-1024',
          title: 'Document Title',
          category: 'Industrial Clearance',
          slaDays: 30,
          fee: 5000,
          description: 'Document description',
          requiredDocs: ['Site Plan', 'Identity Proof'],
          requiresInspection: true,
          inspectionTiming: 'Before Approval Issuance',
          status: 'ACTIVE',
          createdAt: '2026-09-12',
        }),
      });
      const createClearanceData = await createClearanceRes.json();
      console.log('Status:', createClearanceRes.status, 'Created Docket:', createClearanceData.data?.id, createClearanceData.data?.title);
      if (createClearanceRes.status !== 201) throw new Error('main-auth create clearance doc failed');

      console.log('\n[10.2] Testing POST /api/main-auth/create-doc (Scheme Policy)...');
      const createSchemeRes = await fetch(`${base}/main-auth/create-doc`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'SCHEME',
          id: 'SCHEME-1024',
          fileName: 'policy.pdf',
          schemeTitle: 'Scheme Title',
          disbursingAuthority: 'Directorate of Industries',
          maxCeilingAmount: '₹2.50 Crores',
          subsidyPercentage: '35%',
          targetSectors: ['Food Processing'],
          eligibilityCriteria: ['Condition 1'],
          status: 'PUBLISHED',
          datePublished: '2026-09-12',
        }),
      });
      const createSchemeData = await createSchemeRes.json();
      console.log('Status:', createSchemeRes.status, 'Created Scheme:', createSchemeData.data?.id, createSchemeData.data?.schemeTitle);
      if (createSchemeRes.status !== 201) throw new Error('main-auth create scheme doc failed');

      console.log('\n[10.3] Testing POST /api/main-auth/local-authorities...');
      const regAuthRes = await fetch(`${base}/main-auth/local-authorities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Officer Name',
          designation: 'Scrutiny Officer',
          body: 'Maharashtra Pollution Control Board',
          district: 'Pune',
          phone: '+91 9800000000',
          email: 'officer@gov.in',
        }),
      });
      const regAuthData = await regAuthRes.json();
      console.log('Status:', regAuthRes.status, 'Registered Officer:', regAuthData.data?.name, 'District:', regAuthData.data?.district);
      if (regAuthRes.status !== 201) throw new Error('main-auth register local authority failed');

      console.log(`\n[10.4] Testing POST /api/main-auth/complaints/${testComplaintId}/intervene...`);
      const interveneRes = await fetch(`${base}/main-auth/complaints/${testComplaintId}/intervene`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'EXPEDITE_NOTICE_SENT',
          noticeTimestamp: '2026-09-12T13:30:00.000Z',
        }),
      });
      const interveneData = await interveneRes.json();
      console.log('Status:', interveneRes.status, 'Action:', interveneData.data?.intervention?.action);
      if (interveneRes.status !== 200) throw new Error('main-auth intervene complaint failed');

      console.log('\n[10.5] Testing POST /api/main-auth/requests/APP-MH-2026-89412/approve...');
      const apexApproveRes = await fetch(`${base}/main-auth/requests/APP-MH-2026-89412/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          signedDocId: 'IAS-SANCTION-MH-2026-901',
          remarks: 'Approved subject to quarterly compliance report.',
        }),
      });
      const apexApproveData = await apexApproveRes.json();
      console.log('Status:', apexApproveRes.status, 'Sanctioned DSC:', apexApproveData.data?.centralApproval?.signedDocId);
      if (apexApproveRes.status !== 200) throw new Error('main-auth approve failed');

      console.log('\n[10.6] Testing POST /api/main-auth/requests/APP-MH-2026-89412/reject...');
      const apexRejectRes = await fetch(`${base}/main-auth/requests/APP-MH-2026-89412/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rejectionReason: 'Violation of Coastal Regulation Zone guidelines',
          grounds: 'Environment Protection Act Section 5',
        }),
      });
      const apexRejectData = await apexRejectRes.json();
      console.log('Status:', apexRejectRes.status, 'Rejected Grounds:', apexRejectData.data?.centralApproval?.grounds);
      if (apexRejectRes.status !== 200) throw new Error('main-auth reject failed');

      console.log('\n🎉 ALL SERVICES 4 THROUGH 10 TESTED SUCCESSFULLY AND VERIFIED WORKING!\n');
    } catch (testError) {
      console.error('\n❌ Test Failure:', testError);
    } finally {
      await mongoose.disconnect();
      server.close();
      setTimeout(() => process.exit(0), 200);
    }
  });
}

runAllTests();
