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
    profileStatus: user.profileStatus || 'INCOMPLETE',
    profileCompletion: user.profileCompletion || 20,
    ownershipType: user.ownershipType || 'REGISTERED_COMPANY',
    verifiedDocuments: user.verifiedDocuments || [],
    factoryDetails: user.factoryDetails || {},
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
    // Explicitly select password since it has select: false in schema
    const user = await User.findOne({ email: emailClean }).select('+password');

    console.log(`[authController:login] Attempt for email: "${emailClean}" | User found: ${Boolean(user)} | Role: ${user?.role}`);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials',
      });
    }

    const isMatch = await user.matchPassword(password);
    console.log(`[authController:login] Password match result: ${isMatch}`);
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

    // OTP Verification Check (Accepts valid OTP record or demo code 123456 in dev only)
    if (otp) {
      const isDemoOtp = process.env.NODE_ENV === 'development' && otp.trim() === '123456';
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

    const ownerFullName = fullName || name || (role === 'USER' ? 'Enterprise Owner' : emailClean.split('@')[0]);
    const enterpriseLegalName = companyName || (role === 'USER' ? (name || 'My Enterprise') : undefined);
    const displayName = ownerFullName;

    // Check if user already exists
    const existingUser = await User.findOne({ email: emailClean });
    if (existingUser) {
      // In development mode, allow re-registration/updating to avoid duplicate email lockouts
      if (process.env.NODE_ENV === 'development') {
        console.log(`[authController:register] Updating existing user "${emailClean}" with new credentials in dev mode`);
        existingUser.name = ownerFullName;
        existingUser.fullName = ownerFullName;
        if (enterpriseLegalName) {
          existingUser.companyName = enterpriseLegalName;
        }
        existingUser.password = password; // Triggers pre-save bcrypt hash
        existingUser.role = role.toUpperCase();
        existingUser.portalType = portalType || role.toUpperCase();
        if (phone) existingUser.phone = phone;
        if (industryType) existingUser.industryType = industryType;
        if (district) existingUser.district = district;
        if (designation) existingUser.designation = designation;
        if (authorityBody) {
          existingUser.authorityBody = authorityBody;
          existingUser.department = authorityBody;
        }
        if (employeeId) existingUser.employeeId = employeeId;
        existingUser.isActive = true;
        await existingUser.save();

        const token = generateToken(existingUser._id, existingUser.role, existingUser.email);
        res.cookie('token', token, {
          httpOnly: true,
          secure: false,
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
          success: true,
          message: 'Account updated and registered successfully',
          token,
          user: sanitizeUser(existingUser),
        });
      }

      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists. Please log in.',
      });
    }

    // Create new User
    const newUser = await User.create({
      name: ownerFullName,
      fullName: ownerFullName,
      companyName: enterpriseLegalName,
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
      ownershipType: req.body.ownershipType || (role.toUpperCase() === 'USER' ? 'REGISTERED_COMPANY' : 'INDIVIDUAL'),
      profileStatus: role.toUpperCase() === 'USER' ? 'INCOMPLETE' : 'COMPLETED',
      profileCompletion: role.toUpperCase() === 'USER' ? 20 : 100,
      verifiedDocuments: [],
      isVerified: role.toUpperCase() !== 'USER',
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

    // Support demo OTP 123456 only in development
    if (process.env.NODE_ENV === 'development' && otpClean === '123456') {
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

    // Generate random 32-byte reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save({ validateBeforeSave: false });

    // Build absolute URL for password reset
    const clientBaseUrl = process.env.CLIENT_URL || req.headers.origin || 'http://localhost:5173';
    const resetLink = `${clientBaseUrl}/reset-password/${resetToken}`;

    // Send formatted email with clickable link
    await sendEmail({
      to: emailClean,
      subject: 'SARAL Single-Window - Reset Your Account Password',
      text: `Hello,\n\nYou requested a password reset for your SARAL portal account (${emailClean}).\n\nClick the link below to set a new password:\n${resetLink}\n\nThis link is valid for 1 hour. If you did not request this, please disregard this email and your password will remain unchanged.`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; color: #1e293b;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h2 style="color: #0d47a1; margin: 0 0 6px 0; font-size: 22px; font-weight: 700;">SARAL Single-Window Portal</h2>
            <p style="color: #64748b; font-size: 13px; margin: 0;">Government of Maharashtra • Industrial Clearances & Regulatory Approvals</p>
          </div>
          <div style="padding: 24px; background-color: #f8fafc; border-radius: 8px; border-left: 4px solid #0d47a1;">
            <p style="color: #1e293b; font-size: 15px; margin: 0 0 12px 0; font-weight: 600;">Password Reset Request</p>
            <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 0 0 20px 0;">
              We received a request to reset the password for your account associated with <strong>${emailClean}</strong>.
            </p>
            <div style="text-align: center; margin: 28px 0;">
              <a href="${resetLink}" target="_blank" rel="noopener noreferrer" style="background-color: #0d47a1; color: #ffffff; padding: 12px 28px; font-size: 14px; font-weight: 600; text-decoration: none; border-radius: 6px; display: inline-block; box-shadow: 0 2px 4px rgba(13, 71, 161, 0.2);">
                Reset My Password &rarr;
              </a>
            </div>
            <p style="color: #64748b; font-size: 12px; margin: 0 0 6px 0;">If the button above does not work, copy and paste this link into your browser:</p>
            <p style="color: #0d47a1; font-size: 12px; word-break: break-all; margin: 0; font-family: monospace;">
              <a href="${resetLink}" style="color: #0d47a1;">${resetLink}</a>
            </p>
          </div>
          <p style="color: #94a3b8; font-size: 12px; margin-top: 20px; line-height: 1.5;">
            ⏱️ This password reset link will expire in <strong>1 hour</strong>. If you did not make this request, you can safely ignore this email.
          </p>
        </div>
      `,
    });

    return res.status(200).json({
      success: true,
      message: 'Password reset instructions with link dispatched to your email',
      resetLink: process.env.NODE_ENV === 'development' ? resetLink : undefined,
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

    const hashedToken = crypto.createHash('sha256').update(token.trim()).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Password reset link is invalid or has expired. Please request a new one.',
      });
    }

    // Ensure name and fullName exist for legacy documents
    if (!user.name) {
      user.name = user.fullName || user.get('full_name') || user.email.split('@')[0] || 'User';
    }
    if (!user.fullName) {
      user.fullName = user.name;
    }

    // Set new password (auto-hashed by User model pre-save hook)
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save({ validateBeforeSave: false });

    // Generate JWT token so user can optionally be logged in immediately
    const jwtToken = generateToken(user._id, user.role, user.email);

    res.cookie('token', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: 'Password reset successfully! You can now log in with your new password.',
      token: jwtToken,
      user: sanitizeUser(user),
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

// Helper to build full enterprise profile structure from User document without mock fallbacks
const formatEnterpriseProfile = (user) => {
  const districtName = user.district || '';
  const idSuffix = user._id ? user._id.toString().slice(-6).toUpperCase() : 'NEW';
  const regDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'Recently Registered';

  const isCompleted = user.profileStatus === 'COMPLETED';

  return {
    businessId: `ENT-MH-${idSuffix}`,
    factoryName: user.companyName || user.name || 'Industrial Enterprise',
    businessType: user.industryType || 'Pending Classification',
    category: user.industryType ? `${user.industryType} Enterprise` : 'Unclassified',
    currentStage: isCompleted ? 'Operational / Verified' : 'Incomplete Registration',
    profileStatus: user.profileStatus || 'INCOMPLETE',
    profileCompletion: user.profileCompletion || 20,
    ownershipType: user.ownershipType || 'REGISTERED_COMPANY',
    verifiedDocuments: user.verifiedDocuments || [],
    udyamNumber: user.udyogAadhaar || '',
    gstNumber: user.gstin || '',
    panNumber: user.panNumber || '',
    startDate: regDate,
    location: {
      plotNumber: user.address?.street || '',
      area: user.address?.city || (districtName ? `MIDC ${districtName} Industrial Corridor` : ''),
      district: districtName,
      taluka: districtName,
      state: user.state || 'Maharashtra',
      pincode: user.address?.pincode || '',
    },
    factoryDetails: {
      plotArea: user.factoryDetails?.plotArea || '',
      builtArea: user.factoryDetails?.builtArea || '',
      electricityLoad: user.factoryDetails?.electricityLoad || '',
      dailyWaterUse: user.factoryDetails?.dailyWaterUse || '',
      wasteWaterSetup: user.factoryDetails?.wasteWaterSetup || '',
      machineCost: user.factoryDetails?.machineCost || '',
      totalProjectCost: user.factoryDetails?.totalProjectCost || '',
      enterpriseDescription: user.factoryDetails?.enterpriseDescription || '',
    },
    ownerDetails: {
      fullName: user.fullName || user.name || '',
      post: user.designation || (user.role === 'USER' ? 'Authorized Signatory / Owner' : 'Official'),
      email: user.email,
      mobileNumber: user.phone || '',
      idNumber: user.panNumber || '',
    },
    licenses: {
      fssaiNumber: '',
      mpcbNumber: '',
      fireNocNumber: '',
      factoryLicenseStatus: isCompleted ? 'Approved & In Vault' : 'Not Applied',
    },
  };
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

    const sanitized = sanitizeUser(user);
    const enterprise = formatEnterpriseProfile(user);

    return res.status(200).json({
      success: true,
      data: {
        ...sanitized,
        enterprise,
        profile: enterprise,
      },
      user: sanitized,
      enterprise,
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
      factoryName,
      phone,
      industryType,
      businessType,
      district,
      state,
      panNumber,
      gstNumber,
      gstin,
      cin,
      udyamNumber,
      udyogAadhaar,
      enterpriseScale,
      address,
      location,
      ownerDetails,
      avatar,
      designation,
      authorityBody,
      officeAddress,
      officeContact,
    } = req.body;

    if (name) {
      user.name = name.trim();
      if (!user.fullName) user.fullName = name.trim();
    }
    if (fullName) {
      user.fullName = fullName.trim();
      user.name = fullName.trim();
    }
    if (companyName || factoryName) user.companyName = (companyName || factoryName).trim();
    if (phone) user.phone = phone.trim();
    if (industryType || businessType) user.industryType = (industryType || businessType).trim();
    if (district) user.district = district.trim();
    if (state) user.state = state.trim();
    if (panNumber) user.panNumber = panNumber.trim().toUpperCase();
    if (gstin || gstNumber) user.gstin = (gstin || gstNumber).trim().toUpperCase();
    if (cin) user.cin = cin.trim().toUpperCase();
    if (udyogAadhaar || udyamNumber) user.udyogAadhaar = (udyogAadhaar || udyamNumber).trim().toUpperCase();
    if (enterpriseScale) user.enterpriseScale = enterpriseScale;

    // Handle nested address or location
    if (location) {
      user.address = {
        street: location.plotNumber || location.area || user.address?.street,
        city: location.taluka || location.area || user.address?.city,
        district: location.district || user.district,
        state: location.state || user.state || 'Maharashtra',
        pincode: location.pincode || user.address?.pincode,
      };
      if (location.district) user.district = location.district;
    } else if (address) {
      user.address = address;
    }

    // Handle nested owner details
    if (ownerDetails) {
      if (ownerDetails.fullName) {
        user.fullName = ownerDetails.fullName.trim();
        user.name = ownerDetails.fullName.trim();
      }
      if (ownerDetails.mobileNumber) user.phone = ownerDetails.mobileNumber.trim();
      if (ownerDetails.post) user.designation = ownerDetails.post.trim();
      if (ownerDetails.idNumber) user.panNumber = ownerDetails.idNumber.trim().toUpperCase();
    }

    if (avatar) user.avatar = avatar;
    if (designation) user.designation = designation;
    if (authorityBody) {
      user.authorityBody = authorityBody;
      user.department = authorityBody;
    }
    if (officeAddress) user.officeAddress = officeAddress;
    if (officeContact) user.officeContact = officeContact;

    const updatedUser = await user.save();
    const sanitized = sanitizeUser(updatedUser);
    const enterprise = formatEnterpriseProfile(updatedUser);

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        ...sanitized,
        enterprise,
        profile: enterprise,
      },
      user: sanitized,
      enterprise,
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
