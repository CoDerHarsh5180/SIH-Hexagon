export const districtsInState = [
  'Aurangabad (Chhatrapati Sambhajinagar)',
  'Mumbai City',
  'Mumbai Suburban',
  'Pune',
  'Thane',
  'Nagpur',
  'Nashik',
  'Kolhapur',
  'Solapur',
];

export const authorityBodies = [
  'Municipal Corporation (Town Planning)',
  'Maharashtra Pollution Control Board (MPCB)',
  'Maharashtra Fire Services / MIDC Fire Wing',
  'Sub-Divisional Officer (SDO / Revenue)',
  'Directorate of Industrial Safety & Health (DISH)',
  'District Industries Centre (DIC)',
];

export const mockAuthApi = {
  sendOtp: (email) => {
    console.log(`[API MOCK] Verification OTP sent to: ${email}`);
    return { success: true, message: 'OTP sent successfully to your email address.' };
  },
  verifyOtpAndRegister: (payload) => {
    console.log('[API MOCK] Submitting Registration Payload:', payload);
    return { success: true, token: 'JWT-TOKEN-MOCK-90812' };
  },
  loginWithOtp: (payload) => {
    console.log('[API MOCK] Logging in with payload:', payload);
    return { success: true, token: 'JWT-TOKEN-MOCK-34901' };
  },
};