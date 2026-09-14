import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    fullName: {
      type: String,
      trim: true,
    },
    companyName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email address',
      ],
      index: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    role: {
      type: String,
      enum: ['USER', 'LOCAL_AUTH', 'MAIN_AUTH', 'ADMIN'],
      default: 'USER',
      index: true,
    },
    portalType: {
      type: String,
      enum: ['USER', 'LOCAL_AUTH', 'MAIN_AUTH'],
      default: 'USER',
    },
    // Enterprise / User Portal fields
    industryType: {
      type: String,
      trim: true,
    },
    district: {
      type: String,
      trim: true,
      index: true,
    },
    state: {
      type: String,
      default: 'Maharashtra',
    },
    panNumber: {
      type: String,
      trim: true,
      uppercase: true,
    },
    gstin: {
      type: String,
      trim: true,
      uppercase: true,
    },
    cin: {
      type: String,
      trim: true,
      uppercase: true,
    },
    udyogAadhaar: {
      type: String,
      trim: true,
    },
    enterpriseScale: {
      type: String,
      enum: ['MICRO', 'SMALL', 'MEDIUM', 'LARGE'],
    },
    address: {
      street: String,
      city: String,
      district: String,
      state: { type: String, default: 'Maharashtra' },
      pincode: String,
    },
    avatar: {
      type: String,
      default: '',
    },
    // Authority Specific Fields (LOCAL_AUTH / MAIN_AUTH)
    designation: {
      type: String,
      trim: true,
    },
    authorityBody: {
      type: String,
      trim: true,
    },
    department: {
      type: String,
      trim: true,
    },
    employeeId: {
      type: String,
      trim: true,
      index: true,
    },
    officeAddress: {
      type: String,
      trim: true,
    },
    officeContact: {
      type: String,
      trim: true,
    },
    // Verification & Status
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // OTP & Password Reset
    otp: {
      type: String,
    },
    otpExpiresAt: {
      type: Date,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpiresAt: {
      type: Date,
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-populate fullName/name if either is missing & hash password
userSchema.pre('save', async function () {
  if (!this.fullName && this.name) {
    this.fullName = this.name;
  }
  if (!this.name && this.fullName) {
    this.name = this.fullName;
  }

  // Only hash password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to verify entered password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
export { User };
