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
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 600, // Document automatically removed after 10 minutes (600 seconds)
    },
  },
  {
    timestamps: true,
  }
);

const Otp = mongoose.model('Otp', otpSchema);
export default Otp;
export { Otp };
