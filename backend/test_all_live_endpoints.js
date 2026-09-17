// Test script to ping every single route on the live backend (port 5000)

const BASE = 'http://localhost:5000/api';

async function testEndpoint(method, path, body = null, token = null) {
  const headers = {};
  if (body) headers['Content-Type'] = 'application/json';
  if (token) headers['Authorization'] = `Bearer ${token}`;

  try {
    const res = await fetch(`${BASE}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
    return { ok: res.ok, status: res.status, data };
  } catch (err) {
    return { ok: false, status: 'CONN_ERR', error: err.message };
  }
}

async function run() {
  console.log('Testing live endpoints against http://localhost:5000/api...\n');
  const results = [];

  async function check(name, method, path, body, token) {
    const res = await testEndpoint(method, path, body, token);
    const pass = res.status >= 200 && res.status < 300;
    results.push({ name, method, path, status: res.status, pass, data: res.data });
    console.log(`[${pass ? 'PASS' : 'FAIL'}] ${method} ${path} -> ${res.status}`);
    if (!pass) {
      console.log('       Response:', JSON.stringify(res.data || res.error).slice(0, 150));
    }
    return res;
  }

  // 1. Health
  await check('Health Check', 'GET', '/health');

  // 2. Approvals
  await check('Get Approvals Catalog', 'GET', '/approvals');
  await check('Get Approval by ID (appr-01)', 'GET', '/approvals/appr-01');
  await check('Evaluate Approvals', 'POST', '/approvals/evaluate', {
    sector: 'Food Factory',
    district: 'Pune',
    enterpriseScale: 'MICRO',
    landType: 'MIDC Industrial Allotted Plot',
  });
  await check('Calculate Statutory Fees', 'POST', '/approvals/calculator', {
    approvalIds: ['appr-01'],
  });
  await check('Get Required Documents', 'POST', '/approvals/required-documents', {
    approvalIds: ['appr-01'],
  });

  // 3. Auth
  const testEmail = `ping_test_${Date.now()}@example.com`;
  const otpRes = await check('Send OTP', 'POST', '/auth/send-otp', {
    email: testEmail,
    role: 'USER',
  });
  await check('Verify OTP', 'POST', '/auth/verify-otp', {
    email: testEmail,
    otp: otpRes.data?.otp || '123456',
  });
  const regRes = await check('Register USER', 'POST', '/auth/register', {
    name: 'Live Test Co',
    fullName: 'Live Test User',
    companyName: 'Live Test Co',
    email: testEmail,
    phone: '+91 9999999999',
    password: 'password123',
    industryType: 'Manufacturing',
    role: 'USER',
    otp: '123456',
  });
  const loginRes = await check('Login USER', 'POST', '/auth/login', {
    email: 'ping_test@example.com',
    password: 'password123',
    portalType: 'USER',
  });
  const token = loginRes.data?.token || regRes.data?.token;
  await check('Get User Profile', 'GET', '/auth/profile', null, token);
  await check('Update User Profile', 'PUT', '/auth/profile', { companyName: 'Live Test Co Updated' }, token);
  await check('Forgot Password', 'POST', '/auth/forgot-password', { email: 'ping_test@example.com' });

  // 4. Applications
  const appSubmit = await check('Submit Application', 'POST', '/applications', {
    approvalId: 'appr-01',
    approvalTitle: 'Consent to Establish (CTE)',
    feePaid: 15000,
    submissionDate: new Date().toISOString(),
  });
  const testAppId = appSubmit.data?.applicationId || 'APP-MH-2026-89412';
  await check('Submit Custom Application', 'POST', '/applications/custom-apply', {
    approvalId: 'DOC-TEST-01',
    title: 'Custom Clearance Test',
    authority: 'MPCB',
    district: 'Pune',
  });
  await check('Get User Applications', 'GET', '/applications');
  await check('Get Application By ID', 'GET', `/applications/${testAppId}`);
  await check('Respond Discrepancy', 'POST', `/applications/${testAppId}/discrepancy-response`, {
    remarks: 'Discrepancy resolved test response',
  });
  await check('Submit Fee Payment', 'POST', `/applications/${testAppId}/fee-payment`, {
    utrNumber: '998877665544',
    amount: 15000,
    paymentMethod: 'UPI',
  });
  await check('Withdraw Application', 'POST', `/applications/${testAppId}/withdraw`, {
    reason: 'Testing withdrawal',
  });

  // 5. Tracking
  await check('Public Lookup', 'POST', '/tracking/public-lookup', {
    applicationId: testAppId,
    verificationCode: appSubmit.data?.verificationCode || '123456',
  });
  await check('SLA Escalation', 'POST', `/tracking/${testAppId}/escalate`, {
    remarks: 'Testing escalation',
  });
  await check('Get Pipeline', 'GET', `/tracking/${testAppId}`);
  await check('Get Audit History', 'GET', `/tracking/${testAppId}/history`);

  // 6. Vault
  const vaultUpload = await check('Upload Document', 'POST', '/vault/documents/upload', {
    documentName: 'Pollution Board Clearance Certificate',
    category: 'ENVIRONMENT',
  });
  const docId = vaultUpload.data?.data?._id;
  await check('Get Vault Documents', 'GET', '/vault/documents');
  await check('Get Pending Docs', 'GET', '/vault/pending-docs');
  if (docId) {
    await check('Get Vault Document By ID', 'GET', `/vault/documents/${docId}`);
    await check('Renew Vault Document', 'POST', `/vault/documents/${docId}/renew`, { utrNumber: 'UTR123456' });
    await check('Download Document/Certificate', 'GET', `/vault/documents/${docId}/download`);
  }

  // 7. Grievances
  const queryRes = await check('Submit Query', 'POST', '/grievances/queries', {
    department: 'MPCB',
    query: 'What is the required setback?',
    district: 'Pune',
  });
  await check('Get Queries', 'GET', '/grievances/queries');
  if (queryRes.data?.queryId) {
    await check('Get Query By ID', 'GET', `/grievances/queries/${queryRes.data.queryId}`);
  }

  const compRes = await check('Submit Complaint', 'POST', '/grievances/complaints', {
    applicationId: testAppId,
    authority: 'MPCB',
    complaintType: 'SLA Exceeded',
    subject: 'Delayed approval',
    description: 'No response for 45 days',
  });
  const compId = compRes.data?.complaintId;
  await check('Get Complaints', 'GET', '/grievances/complaints');
  if (compId) {
    await check('Get Complaint By ID', 'GET', `/grievances/complaints/${compId}`);
  }

  await check('Submit Feedback', 'POST', '/grievances/feedback', {
    department: 'MPCB',
    rating: 5,
    comments: 'Good service',
  });
  await check('Get Feedback Stats', 'GET', '/grievances/feedback/stats');

  // 8. Benefits
  const schemesRes = await check('Get Benefits Schemes', 'GET', '/benefits/schemes');
  const firstScheme = schemesRes.data?.data?.[0];
  const schemeId = firstScheme?.id || 'SCHEME-1024';
  await check('Get Scheme By ID', 'GET', `/benefits/schemes/${schemeId}`);
  await check('Check Scheme Eligibility', 'POST', `/benefits/schemes/${schemeId}/check-eligibility`, {
    machineryCostCrores: 3,
  });
  await check('Apply Scheme', 'POST', `/benefits/schemes/${schemeId}/apply`, {
    schemeTitle: 'Test Scheme Apply',
    category: 'Subsidy',
  });

  // 9. Notifications
  await check('Get Notifications', 'GET', '/notifications');
  await check('Get Unread Count', 'GET', '/notifications/unread-count');
  await check('Mark All As Read', 'POST', '/notifications/mark-all-read', {});

  // 10. Local Auth
  await check('Get Inward Requests', 'GET', '/local-auth/requests');
  await check('Get Request Dossier', 'GET', `/local-auth/requests/${testAppId}`);
  await check('Get Local Auth History', 'GET', '/local-auth/history');
  await check('Schedule Inspection', 'POST', `/local-auth/requests/${testAppId}/schedule-inspection`, {
    inspectionDate: '2026-09-30',
    inspectorName: 'Anand Patil',
  });
  await check('Submit Inspection Report', 'POST', `/local-auth/requests/${testAppId}/inspection-report`, {
    findings: 'All clear',
    status: 'PASSED',
  });
  await check('Submit Scrutiny Decision', 'POST', `/local-auth/requests/${testAppId}/scrutiny`, {
    decision: 'APPROVED',
  });
  if (compId) {
    await check('Resolve Complaint (Local Auth)', 'POST', `/local-auth/complaints/${compId}/resolve`, {
      resolutionText: 'Resolved by officer',
      status: 'RESOLVED',
    });
  }

  // 11. Main Auth
  await check('Get Main Auth Analytics', 'GET', '/main-auth/analytics');
  await check('Get Master Catalog', 'GET', '/main-auth/catalog');
  await check('Create Master Doc', 'POST', '/main-auth/create-doc', {
    id: 'DOC-NEW-LIVE-01',
    title: 'New Master Clearance Test',
    category: 'Industrial Clearance',
    slaDays: 20,
    fee: 3000,
  });
  await check('Get Local Authorities Directory', 'GET', '/main-auth/local-authorities');
  await check('Register Local Authority', 'POST', '/main-auth/local-authorities', {
    name: 'Officer Live Test',
    designation: 'Field Inspector',
    body: 'MPCB',
    district: 'Pune',
    email: 'officer_live@gov.in',
  });
  await check('Get State Complaints', 'GET', '/main-auth/complaints');
  if (compId) {
    await check('Intervene Complaint (Main Auth)', 'POST', `/main-auth/complaints/${compId}/intervene`, {
      action: 'EXPEDITE_NOTICE_SENT',
    });
  }
  await check('Get Central Requests', 'GET', '/main-auth/requests');
  await check('Get Central Request By ID', 'GET', `/main-auth/requests/${testAppId}`);
  await check('Approve Central Request', 'POST', `/main-auth/requests/${testAppId}/approve`, {
    signedDocId: 'DSC-12345',
  });
  await check('Reject Central Request', 'POST', `/main-auth/requests/${testAppId}/reject`, {
    rejectionReason: 'Test rejection',
  });

  // 12. Public Dashboard
  await check('Get Public Metrics', 'GET', '/dashboard/public');
  await check('Get Monthly Velocity', 'GET', '/dashboard/monthly-velocity');
  await check('Get Department Matrix', 'GET', '/dashboard/department-matrix');
  await check('Get District Matrix', 'GET', '/dashboard/district-matrix');

  // Summary
  const passed = results.filter(r => r.pass).length;
  const failed = results.filter(r => !r.pass).length;
  console.log(`\n================================`);
  console.log(`TOTAL ENDPOINTS TESTED: ${results.length}`);
  console.log(`PASSED: ${passed}`);
  console.log(`FAILED: ${failed}`);
  console.log(`================================`);
}

run();
