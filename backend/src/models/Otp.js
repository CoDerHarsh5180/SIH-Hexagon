import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required for OTP'],
      lowercase: true,
      trim: true,
      index: true,
    },
    otp: {
      type: String,
      required: [true, 'OTP is required'],
    },
    role: {
      type: String,
      enum: ['USER', 'LOCAL_AUTH', 'MAIN_AUTH'],
      default: 'USER',
    },
    purpose: {
      type: String,
      enum: ['REGISTRATION', 'LOGIN', 'FORGOT_PASSWORD', 'VERIFICATION'],
      default: 'REGISTRATION',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Otp = mongoose.model('Otp', otpSchema);

// TTL index: auto-delete OTP documents 10 minutes after creation
otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 600 });

export default Otp;
export { Otp };
