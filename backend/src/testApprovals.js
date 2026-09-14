import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import connectDB from './config/db.js';
import { seedApprovalsCatalog } from './utils/seedApprovals.js';

let server;

async function runTests() {
  console.log('🧪 Starting Approvals APIs Test Suite...\n');

  try {
    await connectDB();
    await seedApprovalsCatalog();
  } catch (err) {
    console.warn('[Test DB Warning]', err.message);
  }

  const PORT = 5056;
  server = app.listen(PORT, async () => {
    console.log(`Test server running on port ${PORT}`);
    const baseUrl = `http://localhost:${PORT}/api/approvals`;

    try {
      // 1. Evaluate Questionnaire
      console.log('\n[1/5] Testing POST /api/approvals/evaluate...');
      const evalPayload = {
        sector: 'Food Factory',
        subSector: 'Dairy & Milk Processing',
        enterpriseScale: 'MICRO',
        district: 'Aurangabad',
        landType: 'MIDC Industrial Allotted Plot',
        plotAreaSqM: 4180,
        builtUpAreaSqM: 2640,
        connectedPowerLoadKW: 260,
        dailyWaterConsumptionKLD: 12,
        hasBoiler: false,
        hasDGSet: false,
        generatesHazardousWaste: false,
        pollutionTier: 'Orange',
        totalCapitalInvestmentInr: 125000000,
        workforceCount: 45,
      };

      const evalRes = await fetch(`${baseUrl}/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(evalPayload),
      });
      const evalData = await evalRes.json();
      console.log('Status:', evalRes.status, 'Total Clearances Count:', evalData.data?.totalApprovalsCount, 'Total Fee:', `₹${evalData.data?.totalEstimatedFeeInr}`);
      console.log('Mandatory Clearances identified:');
      evalData.data?.mandatoryApprovals?.forEach((a, idx) => {
        console.log(`  ${idx + 1}. [${a.approvalId}] ${a.title} (${a.authority}) - ₹${a.fee} [SLA: ${a.maxSlaDays} days]`);
      });

      if (evalRes.status !== 200 || !evalData.data?.mandatoryApprovals?.length) {
        throw new Error('evaluate questionnaire failed');
      }

      // 2. Calculate Fees
      console.log('\n[2/5] Testing POST /api/approvals/calculator...');
      const calcRes = await fetch(`${baseUrl}/calculator`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          approvalIds: ['appr-01', 'appr-02'],
        }),
      });
      const calcData = await calcRes.json();
      console.log('Status:', calcRes.status, 'Grand Total Fee:', `₹${calcData.data?.grandTotal}`, 'Items:', calcData.data?.breakdown?.length);
      calcData.data?.breakdown?.forEach((b) => {
        console.log(`  • ${b.title}: ₹${b.fee}`);
      });
      if (calcRes.status !== 200 || calcData.data?.grandTotal !== 22500) {
        throw new Error('calculate fees failed');
      }

      // 3. Required Documents
      console.log('\n[3/5] Testing POST /api/approvals/required-documents...');
      const reqDocsRes = await fetch(`${baseUrl}/required-documents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          approvalIds: ['appr-01', 'appr-02'],
        }),
      });
      const reqDocsData = await reqDocsRes.json();
      console.log('Status:', reqDocsRes.status, 'Unique Documents Count:', reqDocsData.data?.uniqueDocumentNames?.length);
      reqDocsData.data?.requiredDocuments?.forEach((doc) => {
        console.log(`  📄 ${doc.documentName} [${doc.category}] (Required for: ${doc.neededFor.join(', ')})`);
      });
      if (reqDocsRes.status !== 200 || !reqDocsData.data?.requiredDocuments?.length) {
        throw new Error('required-documents failed');
      }

      // 4. Get Approvals Catalog
      console.log('\n[4/5] Testing GET /api/approvals...');
      const catalogRes = await fetch(`${baseUrl}`);
      const catalogData = await catalogRes.json();
      console.log('Status:', catalogRes.status, 'Total Catalog Items:', catalogData.count);
      if (catalogRes.status !== 200 || !catalogData.count) {
        throw new Error('get approvals catalog failed');
      }

      // 5. Get Approval by ID
      console.log('\n[5/5] Testing GET /api/approvals/appr-01...');
      const byIdRes = await fetch(`${baseUrl}/appr-01`);
      const byIdData = await byIdRes.json();
      console.log('Status:', byIdRes.status, 'Fetched:', byIdData.data?.title);
      if (byIdRes.status !== 200 || byIdData.data?.id !== 'appr-01') {
        throw new Error('get approval by id failed');
      }

      console.log('\n🎉 ALL APPROVALS APIS TESTED SUCCESSFULLY AND VERIFIED WORKING!\n');
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
