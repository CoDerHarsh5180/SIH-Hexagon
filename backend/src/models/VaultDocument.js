import mongoose from 'mongoose';

const vaultDocumentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    applicationId: {
      type: String,
      trim: true,
      index: true,
    },
    documentName: {
      type: String,
      required: [true, 'Document name is required'],
      trim: true,
    },
    category: {
      type: String,
      default: 'OTHER',
      trim: true,
      index: true,
    },
    fileUrl: {
      type: String,
      required: [true, 'Document file URL is required'],
    },
    cloudinaryPublicId: {
      type: String,
      trim: true,
    },
    fileName: {
      type: String,
    },
    fileSize: {
      type: Number,
    },
    fileType: {
      type: String,
      default: 'application/pdf',
    },
    certificateNumber: {
      type: String,
      trim: true,
    },
    issuedBy: {
      type: String,
    },
    issueDate: {
      type: Date,
    },
    expiryDate: {
      type: Date,
      index: true,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'VERIFIED', 'PENDING_VERIFICATION', 'EXPIRING_SOON', 'EXPIRED', 'RENEWAL_PENDING', 'RENEWED', 'ARCHIVED'],
      default: 'VERIFIED',
      index: true,
    },
    isUserVerified: {
      type: Boolean,
      default: true,
    },
    extractedData: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    renewalHistory: [
      {
        renewalDate: {
          type: Date,
          default: Date.now,
        },
        utrNumber: {
          type: String,
          trim: true,
        },
        amount: {
          type: Number,
          default: 0,
        },
        status: {
          type: String,
          enum: ['PENDING', 'APPROVED', 'REJECTED'],
          default: 'PENDING',
        },
        validUntil: Date,
        remarks: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const VaultDocument = mongoose.model('VaultDocument', vaultDocumentSchema);
export default VaultDocument;
export { VaultDocument };
