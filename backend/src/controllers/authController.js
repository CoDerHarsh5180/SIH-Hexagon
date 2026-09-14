import crypto from 'crypto';
import User from '../models/User.js';
import Otp from '../models/Otp.js';
import LocalAuthority from '../models/LocalAuthority.js';
import { generateToken } from '../utils/generateToken.js';
import { sendEmail } from '../utils/sendEmail.js';

// Helper to sanitize user object for client response
const sanitizeUser = (user) => {
  return {
    _id: user._id,
    name: user.name,
    fullName: user.fullName || user.name,
    companyName: user.companyName || user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    portalType: user.portalType || user.role,
    industryType: user.industryType,
    district: user.district,
    state: user.state,
    panNumber: user.panNumber,
    gstin: user.gstin,
    cin: user.cin,
    udyogAadhaar: user.udyogAadhaar,
    enterpriseScale: user.enterpriseScale,
    address: user.address,
    avatar: user.avatar,
    designation: user.designation,
    authorityBody: user.authorityBody,
    department: user.department,
    employeeId: user.employeeId,
    isVerified: user.isVerified,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

/**
 * @desc    Authenticate User & Get JWT Token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res) => {
  try {
    const { email, password, portalType } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
      });
    }

    const emailClean = email.trim().toLowerCase();
    const user = await User.findOne({ email: emailClean });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'This account has been deactivated. Please contact support.',
      });
    }

    // Update last login timestamp
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    // Generate JWT Token
    const token = generateToken(user._id, user.role, user.email);

    // Set cookie if needed
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error('[authController:login] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during authentication',
      error: error.message,
    });
  }
};

/**
 * @desc    Register a new User (Enterprise Applicant or Local Authority Officer)
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res) => {
  try {
    const {
      name,
      fullName,
      companyName,
      email,
      phone,
      password,
      role = 'USER',
      portalType,
      industryType,
      district,
      designation,
      authorityBody,
      employeeId,
      otp,
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required for registration',
      });
    }

    const emailClean = email.trim().toLowerCase();

    // Check if user already exists
    const existingUser = await User.findOne({ email: emailClean });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists. Please log in.',
      });
    }

    // OTP Verification Check (Accepts valid OTP record or standard demo code 123456)
    if (otp) {
      const isDemoOtp = otp.trim() === '123456';
      if (!isDemoOtp) {
        const otpRecord = await Otp.findOne({
          email: emailClean,
          otp: otp.trim(),
        });

        if (!otpRecord) {
          return res.status(400).json({
            success: false,
            message: 'Invalid or expired OTP verification code.',
          });
        }

        // Clean up OTP record
        await Otp.deleteMany({ email: emailClean });
      }
    }

    const displayName = name || fullName || companyName || emailClean.split('@')[0];

    // Create new User
    const newUser = await User.create({
      name: displayName,
      fullName: fullName || displayName,
      companyName: companyName || (role === 'USER' ? displayName : undefined),
      email: emailClean,
      phone: phone || '',
      password, // Password hashed automatically by User model pre-save hook
      role: role.toUpperCase(),
      portalType: portalType || role.toUpperCase(),
      industryType: industryType || '',
      district: district || 'Pune',
      designation: designation || '',
      authorityBody: authorityBody || '',
      department: authorityBody || '',
      employeeId: employeeId || '',
      isVerified: true,
    });

    // If registered as LOCAL_AUTH, also maintain LocalAuthority registry
    if (role.toUpperCase() === 'LOCAL_AUTH') {
      await LocalAuthority.findOneAndUpdate(
        { email: emailClean },
        {
          name: displayName,
          designation: designation || 'Scrutiny Officer',
          body: authorityBody || 'Maharashtra Regulatory Body',
          authorityBody: authorityBody || 'Maharashtra Regulatory Body',
          district: district || 'Pune',
          phone: phone || '+91 9800000000',
          email: emailClean,
          employeeId: employeeId || `MH-GOV-${Date.now().toString().slice(-4)}`,
          userId: newUser._id,
          status: 'ACTIVE',
        },
        { upsert: true, returnDocument: 'after' }
      );
    }

    const token = generateToken(newUser._id, newUser.role, newUser.email);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      token,
      user: sanitizeUser(newUser),
    });
  } catch (error) {
    console.error('[authController:register] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create user account',
      error: error.message,
    });
  }
};

/**
 * @desc    Logout User / Clear Session
 * @route   POST /api/auth/logout
 * @access  Public
 */
export const logout = async (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error logging out',
      error: error.message,
    });
  }
};

/**
 * @desc    Send 6-digit OTP to Email
 * @route   POST /api/auth/send-otp
 * @access  Public
 */
export const sendOtp = async (req, res) => {
  try {
    const { email, role = 'USER' } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required to send verification code',
      });
    }

    const emailClean = email.trim().toLowerCase();

    // Generate random 6-digit OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

    // Upsert or save in Otp collection
    await Otp.deleteMany({ email: emailClean });
    await Otp.create({
      email: emailClean,
      otp: generatedOtp,
      role: role.toUpperCase(),
      purpose: 'REGISTRATION',
    });

    // Send email dispatch
    await sendEmail({
      to: emailClean,
      subject: 'SARAL Portal - Your 6-Digit Verification Code',
      text: `Your SARAL portal verification code is: ${generatedOtp}. This OTP is valid for 10 minutes. Do not share it with anyone.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; rounded: 8px;">
          <h2 style="color: #0d47a1; margin-bottom: 8px;">SARAL Single-Window Portal</h2>
          <p style="color: #555; font-size: 14px;">Use the following one-time code to complete your verification:</p>
          <div style="background-color: #f0f4ff; padding: 14px; text-align: center; border-radius: 6px; font-size: 24px; font-weight: bold; letter-spacing: 6px; color: #0d47a1; margin: 16px 0;">
            ${generatedOtp}
          </div>
          <p style="color: #888; font-size: 12px;">This code is valid for 10 minutes. If you did not request this code, please ignore this email.</p>
        </div>
      `,
    });

    return res.status(200).json({
      success: true,
      message: `Verification code sent to ${emailClean}`,
      otp: process.env.NODE_ENV === 'development' ? generatedOtp : undefined,
    });
  } catch (error) {
    console.error('[authController:sendOtp] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send OTP verification email',
      error: error.message,
    });
  }
};

/**
 * @desc    Verify OTP
 * @route   POST /api/auth/verify-otp
 * @access  Public
 */
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required',
      });
    }

    const emailClean = email.trim().toLowerCase();
    const otpClean = otp.trim();

    // Support standard demo OTP 123456
    if (otpClean === '123456') {
      return res.status(200).json({
        success: true,
        message: 'OTP verified successfully (Demo code)',
        isVerified: true,
      });
    }

    const record = await Otp.findOne({ email: emailClean, otp: otpClean });
    if (!record) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP verification code',
        isVerified: false,
      });
    }

    record.isVerified = true;
    await record.save();

    return res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      isVerified: true,
    });
  } catch (error) {
    console.error('[authController:verifyOtp] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error verifying OTP code',
      error: error.message,
    });
  }
};

/**
 * @desc    Forgot Password - Request Reset Link/Token
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your account email address',
      });
    }

    const emailClean = email.trim().toLowerCase();
    const user = await User.findOne({ email: emailClean });

    if (!user) {
      // Return 200 for security to avoid email enumeration
      return res.status(200).json({
        success: true,
        message: 'If an account exists with this email, password reset instructions have been dispatched.',
      });
    }

    // Generate random reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save({ validateBeforeSave: false });

    // Send email
    await sendEmail({
      to: emailClean,
      subject: 'SARAL Single-Window - Password Reset Instructions',
      text: `You requested a password reset. Use this token to reset your password: ${resetToken}\nThis token expires in 1 hour.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; rounded: 8px;">
          <h2 style="color: #0d47a1;">SARAL Password Reset</h2>
          <p>You recently requested to reset your password for your SARAL platform account.</p>
          <p><strong>Reset Token:</strong> <code>${resetToken}</code></p>
          <p style="color: #888; font-size: 12px;">This link/token will expire in 1 hour. If you did not request this, please ignore this email.</p>
        </div>
      `,
    });

    return res.status(200).json({
      success: true,
      message: 'Password reset instructions dispatched to your email',
      token: process.env.NODE_ENV === 'development' ? resetToken : undefined,
    });
  } catch (error) {
    console.error('[authController:forgotPassword] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process forgot password request',
      error: error.message,
    });
  }
};

/**
 * @desc    Reset Password using token
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Reset token and new password are required',
      });
    }

    if (confirmPassword && newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'New password and confirmation password do not match',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Password reset token is invalid or has expired.',
      });
    }

    // Set new password (auto-hashed by pre-save hook)
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password reset successful! You can now log in with your new password.',
    });
  } catch (error) {
    console.error('[authController:resetPassword] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to reset password',
      error: error.message,
    });
  }
};

/**
 * @desc    Get Current Logged-in User Profile
 * @route   GET /api/auth/profile
 * @access  Private
 */
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: sanitizeUser(user),
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error('[authController:getProfile] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch user profile',
      error: error.message,
    });
  }
};

/**
 * @desc    Update Current User Profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const {
      name,
      fullName,
      companyName,
      phone,
      industryType,
      district,
      state,
      panNumber,
      gstin,
      cin,
      udyogAadhaar,
      enterpriseScale,
      address,
      avatar,
      designation,
      authorityBody,
      officeAddress,
      officeContact,
    } = req.body;

    if (name) user.name = name;
    if (fullName) user.fullName = fullName;
    if (companyName) user.companyName = companyName;
    if (phone) user.phone = phone;
    if (industryType) user.industryType = industryType;
    if (district) user.district = district;
    if (state) user.state = state;
    if (panNumber) user.panNumber = panNumber;
    if (gstin) user.gstin = gstin;
    if (cin) user.cin = cin;
    if (udyogAadhaar) user.udyogAadhaar = udyogAadhaar;
    if (enterpriseScale) user.enterpriseScale = enterpriseScale;
    if (address) user.address = address;
    if (avatar) user.avatar = avatar;
    if (designation) user.designation = designation;
    if (authorityBody) {
      user.authorityBody = authorityBody;
      user.department = authorityBody;
    }
    if (officeAddress) user.officeAddress = officeAddress;
    if (officeContact) user.officeContact = officeContact;

    const updatedUser = await user.save();

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: sanitizeUser(updatedUser),
      user: sanitizeUser(updatedUser),
    });
  } catch (error) {
    console.error('[authController:updateProfile] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message,
    });
  }
};

export default {
  login,
  register,
  logout,
  sendOtp,
  verifyOtp,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
};
