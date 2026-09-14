import express from 'express';
import {
  login,
  register,
  logout,
  sendOtp,
  verifyOtp,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public Authentication Endpoints
router.post('/login', login);
router.post('/register', register);
router.post('/logout', logout);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Protected Profile Endpoints
router.route('/profile')
  .get(protect, getProfile)
  .put(protect, updateProfile);

export default router;
