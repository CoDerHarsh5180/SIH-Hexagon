import mongoose from 'mongoose';

const schemeApplicationSchema = new mongoose.Schema(
  {
    claimId: {
      type: String,
      unique: true,
      trim: true,
      index: true,
    },
    schemeId: {
      type: String,
      required: [true, 'Scheme ID is required'],
      index: true,
    },
    schemeObjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BenefitScheme',
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    schemeTitle: {
      type: String,
      required: [true, 'Scheme title is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    claimDate: {
      type: Date,
      default: Date.now,
    },
    claimAmount: {
      type: Number,
      default: 0,
    },
    eligibilityInputs: {
      machineryCostCrores: {
        type: Number,
        default: 0,
      },
      powerLoadHp: {
        type: Number,
        default: 0,
      },
      totalInvestment: Number,
      district: String,
      scale: String,
    },
    eligibilityResult: {
      isEligible: {
        type: Boolean,
        default: true,
      },
      estimatedSubsidy: {
        type: Number,
        default: 0,
      },
      remarks: String,
    },
    uploadedDocuments: [
      {
        documentName: String,
        fileUrl: String,
        fileName: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    status: {
      type: String,
      enum: ['SUBMITTED', 'UNDER_VERIFICATION', 'SANCTIONED', 'DISBURSED', 'REJECTED'],
      default: 'SUBMITTED',
      index: true,
    },
    sanctionedAmount: {
      type: Number,
      default: 0,
    },
    disbursedAmount: {
      type: Number,
      default: 0,
    },
    remarks: String,
  },
  {
    timestamps: true,
  }
);

// Auto-generate claimId if missing
schemeApplicationSchema.pre('save', function () {
  if (!this.claimId) {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(1000 + Math.random() * 9000);
    this.claimId = `CLM-SCH-${timestamp}-${random}`;
  }
});

const SchemeApplication = mongoose.model('SchemeApplication', schemeApplicationSchema);
export default SchemeApplication;
export { SchemeApplication };
