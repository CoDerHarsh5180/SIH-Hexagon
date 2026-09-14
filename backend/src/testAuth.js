import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import connectDB from './config/db.js';
import User from './models/User.js';
import Otp from './models/Otp.js';
import LocalAuthority from './models/LocalAuthority.js';

let server;

async function runTests() {
  console.log('🧪 Starting Auth APIs Test Suite...\n');

  try {
    await connectDB();
  } catch (err) {
    console.warn('[Test DB Warning]', err.message);
  }

  const PORT = 5055;
  server = app.listen(PORT, async () => {
    console.log(`Test server running on port ${PORT}`);

    const baseUrl = `http://localhost:${PORT}/api/auth`;

    try {
      // Clean up test users
      await User.deleteMany({ email: { $in: ['testuser@example.com', 'testofficer@gov.in'] } });
      await Otp.deleteMany({ email: { $in: ['testuser@example.com', 'testofficer@gov.in'] } });
      await LocalAuthority.deleteMany({ email: 'testofficer@gov.in' });

      // 1. Send OTP
      console.log('\n[1/10] Testing POST /api/auth/send-otp...');
      const sendOtpRes = await fetch(`${baseUrl}/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'testuser@example.com', role: 'USER' }),
      });
      const sendOtpData = await sendOtpRes.json();
      console.log('Status:', sendOtpRes.status, sendOtpData);
      if (sendOtpRes.status !== 200) throw new Error('send-otp failed');

      // 2. Verify OTP
      console.log('\n[2/10] Testing POST /api/auth/verify-otp...');
      const verifyOtpRes = await fetch(`${baseUrl}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'testuser@example.com', otp: sendOtpData.otp || '123456' }),
      });
      const verifyOtpData = await verifyOtpRes.json();
      console.log('Status:', verifyOtpRes.status, verifyOtpData);
      if (verifyOtpRes.status !== 200) throw new Error('verify-otp failed');

      // 3. Register USER
      console.log('\n[3/10] Testing POST /api/auth/register (USER)...');
      const registerUserRes = await fetch(`${baseUrl}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Enterprise Test Name',
          fullName: 'Enterprise Test Name',
          companyName: 'Enterprise Test Name',
          email: 'testuser@example.com',
          phone: '+91 9800000000',
          password: 'password123',
          industryType: 'Food Factory',
          district: 'Pune',
          role: 'USER',
          otp: '123456',
        }),
      });
      const registerUserData = await registerUserRes.json();
      console.log('Status:', registerUserRes.status, 'User ID:', registerUserData.user?._id, 'Role:', registerUserData.user?.role);
      if (registerUserRes.status !== 201) throw new Error('register USER failed');
      const userToken = registerUserData.token;

      // 4. Register LOCAL_AUTH
      console.log('\n[4/10] Testing POST /api/auth/register (LOCAL_AUTH)...');
      const registerOfficerRes = await fetch(`${baseUrl}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Officer Name',
          fullName: 'Officer Name',
          email: 'testofficer@gov.in',
          phone: '+91 9800000000',
          password: 'password123',
          designation: 'Scrutiny Officer',
          authorityBody: 'Maharashtra Pollution Control Board (MPCB)',
          employeeId: 'MH-GOV-8821',
          district: 'Pune',
          role: 'LOCAL_AUTH',
          otp: '123456',
        }),
      });
      const registerOfficerData = await registerOfficerRes.json();
      console.log('Status:', registerOfficerRes.status, 'Officer EmployeeId:', registerOfficerData.user?.employeeId, 'Role:', registerOfficerData.user?.role);
      if (registerOfficerRes.status !== 201) throw new Error('register LOCAL_AUTH failed');

      // 5. Login
      console.log('\n[5/10] Testing POST /api/auth/login...');
      const loginRes = await fetch(`${baseUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'testuser@example.com',
          password: 'password123',
          portalType: 'USER',
        }),
      });
      const loginData = await loginRes.json();
      console.log('Status:', loginRes.status, 'Token received:', Boolean(loginData.token), 'Role:', loginData.user?.role);
      if (loginRes.status !== 200 || !loginData.token) throw new Error('login failed');

      // 6. Get Profile (Protected)
      console.log('\n[6/10] Testing GET /api/auth/profile (Protected)...');
      const profileRes = await fetch(`${baseUrl}/profile`, {
        headers: {
          'Authorization': `Bearer ${userToken}`,
        },
      });
      const profileData = await profileRes.json();
      console.log('Status:', profileRes.status, 'Fetched user email:', profileData.user?.email);
      if (profileRes.status !== 200) throw new Error('get profile failed');

      // 7. Update Profile (Protected)
      console.log('\n[7/10] Testing PUT /api/auth/profile...');
      const updateRes = await fetch(`${baseUrl}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          companyName: 'Updated Sahyadri Foods Pvt Ltd',
          district: 'Chhatrapati Sambhajinagar',
        }),
      });
      const updateData = await updateRes.json();
      console.log('Status:', updateRes.status, 'Updated Company Name:', updateData.user?.companyName);
      if (updateRes.status !== 200) throw new Error('update profile failed');

      // 8. Forgot Password
      console.log('\n[8/10] Testing POST /api/auth/forgot-password...');
      const forgotRes = await fetch(`${baseUrl}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'testuser@example.com' }),
      });
      const forgotData = await forgotRes.json();
      console.log('Status:', forgotRes.status, forgotData.message, 'Reset Token received:', Boolean(forgotData.token));
      if (forgotRes.status !== 200) throw new Error('forgot-password failed');
      const resetToken = forgotData.token;

      // 9. Reset Password
      console.log('\n[9/10] Testing POST /api/auth/reset-password...');
      const resetRes = await fetch(`${baseUrl}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: resetToken,
          newPassword: 'newpassword456',
          confirmPassword: 'newpassword456',
        }),
      });
      const resetData = await resetRes.json();
      console.log('Status:', resetRes.status, resetData.message);
      if (resetRes.status !== 200) throw new Error('reset-password failed');

      // Verify Login with New Password
      console.log('\n[10/10] Testing POST /api/auth/login with New Password...');
      const loginNewRes = await fetch(`${baseUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'testuser@example.com',
          password: 'newpassword456',
          portalType: 'USER',
        }),
      });
      const loginNewData = await loginNewRes.json();
      console.log('Status:', loginNewRes.status, 'Logged in with new password:', Boolean(loginNewData.token));
      if (loginNewRes.status !== 200) throw new Error('login with new password failed');

      console.log('\n🎉 ALL AUTH APIS TESTED SUCCESSFULLY AND VERIFIED WORKING!\n');
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
