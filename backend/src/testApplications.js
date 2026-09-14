import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import connectDB from './config/db.js';
import Application from './models/Application.js';
import { seedApprovalsCatalog } from './utils/seedApprovals.js';

let server;

async function runTests() {
  console.log('🧪 Starting Applications APIs Test Suite...\n');

  try {
    await connectDB();
    await seedApprovalsCatalog();
  } catch (err) {
    console.warn('[Test DB Warning]', err.message);
  }

  const PORT = 5057;
  server = app.listen(PORT, async () => {
    console.log(`Test server running on port ${PORT}`);
    const baseUrl = `http://localhost:${PORT}/api/applications`;

    try {
      // Clean previous test applications
      await Application.deleteMany({ approvalId: { $in: ['appr-01', 'DOC-MPCB-001', 'test-app-id'] } });

      // 1. Submit Application
      console.log('\n[1/7] Testing POST /api/applications (submitApplication)...');
      const submitPayload = {
        approvalId: 'appr-01',
        approvalTitle: 'Consent to Establish (CTE) — Pollution Board',
        feePaid: 15000,
        submissionDate: '2026-09-12T13:30:00.000Z',
      };

      const submitRes = await fetch(`${baseUrl}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitPayload),
      });
      const submitData = await submitRes.json();
      console.log('Status:', submitRes.status, 'Application ID:', submitData.applicationId, 'Verification Code:', submitData.verificationCode, 'Status:', submitData.data?.status);
      if (submitRes.status !== 201 || !submitData.applicationId) {
        throw new Error('submitApplication failed');
      }
      const standardAppId = submitData.applicationId;

      // 2. Submit Custom Application
      console.log('\n[2/7] Testing POST /api/applications/custom-apply (submitCustomApplication)...');
      const customPayload = {
        approvalId: 'DOC-MPCB-001',
        title: 'Consent to Establish (CTE) - Orange Category',
        authority: 'Maharashtra Pollution Control Board (MPCB)',
        district: 'Aurangabad',
      };

      const customRes = await fetch(`${baseUrl}/custom-apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customPayload),
      });
      const customData = await customRes.json();
      console.log('Status:', customRes.status, 'Custom Application ID:', customData.applicationId, 'Authority:', customData.data?.authority, 'District:', customData.data?.district);
      if (customRes.status !== 201 || !customData.applicationId) {
        throw new Error('submitCustomApplication failed');
      }
      const customAppId = customData.applicationId;

      // 3. Respond to Discrepancy
      console.log(`\n[3/7] Testing POST /api/applications/${standardAppId}/discrepancy-response...`);
      const discrepancyPayload = {
        remarks: 'Clarification comments on setback distances and revised site layouts.',
        uploadedFiles: [
          {
            documentType: 'Revised Layout',
            fileUrl: 'https://storage.saral.gov.in/revised.pdf',
            fileName: 'revised.pdf',
          },
        ],
      };

      const discRes = await fetch(`${baseUrl}/${standardAppId}/discrepancy-response`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(discrepancyPayload),
      });
      const discData = await discRes.json();
      console.log('Status:', discRes.status, 'Application Status:', discData.data?.status, 'Discrepancy count:', discData.data?.discrepancies?.length);
      if (discRes.status !== 200 || discData.data?.status !== 'DISCREPANCY_RESOLVED') {
        throw new Error('respondDiscrepancy failed');
      }

      // 4. Submit Fee Payment
      console.log(`\n[4/7] Testing POST /api/applications/${customAppId}/fee-payment...`);
      const paymentPayload = {
        utrNumber: '423871928312',
        amount: 15000,
        paymentMethod: 'UPI',
      };

      const payRes = await fetch(`${baseUrl}/${customAppId}/fee-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentPayload),
      });
      const payData = await payRes.json();
      console.log('Status:', payRes.status, 'Payment Status:', payData.data?.paymentDetails?.paymentStatus, 'UTR:', payData.data?.paymentDetails?.utrNumber, 'Fee Paid:', `₹${payData.data?.feePaid}`);
      if (payRes.status !== 200 || payData.data?.paymentDetails?.utrNumber !== '423871928312') {
        throw new Error('submitFeePayment failed');
      }

      // 5. Withdraw Application
      console.log(`\n[5/7] Testing POST /api/applications/${customAppId}/withdraw...`);
      const withdrawPayload = {
        reason: 'Project relocation to Supa MIDC industrial zone.',
      };

      const withdrawRes = await fetch(`${baseUrl}/${customAppId}/withdraw`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(withdrawPayload),
      });
      const withdrawData = await withdrawRes.json();
      console.log('Status:', withdrawRes.status, 'Status:', withdrawData.data?.status, 'Withdrawal Reason:', withdrawData.data?.withdrawal?.reason);
      if (withdrawRes.status !== 200 || withdrawData.data?.status !== 'WITHDRAWN') {
        throw new Error('withdrawApplication failed');
      }

      // 6. Get User Applications List
      console.log('\n[6/7] Testing GET /api/applications...');
      const listRes = await fetch(`${baseUrl}`);
      const listData = await listRes.json();
      console.log('Status:', listRes.status, 'Total Applications:', listData.count);
      if (listRes.status !== 200 || listData.count < 2) {
        throw new Error('getUserApplications failed');
      }

      // 7. Get Application by ID
      console.log(`\n[7/7] Testing GET /api/applications/${standardAppId}...`);
      const getByIdRes = await fetch(`${baseUrl}/${standardAppId}`);
      const getByIdData = await getByIdRes.json();
      console.log('Status:', getByIdRes.status, 'Title:', getByIdData.data?.approvalTitle, 'SLA Days:', getByIdData.data?.sla?.slaDays);
      if (getByIdRes.status !== 200 || getByIdData.data?.applicationId !== standardAppId) {
        throw new Error('getApplicationById failed');
      }

      console.log('\n🎉 ALL APPLICATIONS APIS TESTED SUCCESSFULLY AND VERIFIED WORKING!\n');
    } catch (testError) {
      console.error('\n❌ Test Failure:', testError);
    } finally {
      await mongoose.disconnect();
      server.close();
      setTimeout(() => process.exit(0), 200);
    }
  });
}

runTests();
