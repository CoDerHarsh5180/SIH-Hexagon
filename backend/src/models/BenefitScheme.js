import mongoose from 'mongoose';

const benefitSchemeSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: [true, 'Scheme ID is required'],
      unique: true,
      trim: true,
      index: true,
    },
    type: {
      type: String,
      default: 'SCHEME',
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
      index: true,
    },
    disbursingAuthority: {
      type: String,
      required: [true, 'Disbursing authority is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    maxCeilingAmount: {
      type: String,
      default: '₹2.50 Crores',
    },
    maxCeilingAmountNumber: {
      type: Number,
      default: 25000000,
    },
    subsidyPercentage: {
      type: String,
      default: '35%',
    },
    subsidyPercentageNumber: {
      type: Number,
      default: 35,
    },
    targetSectors: [
      {
        type: String,
      },
    ],
    targetScales: [
      {
        type: String,
        enum: ['MICRO', 'SMALL', 'MEDIUM', 'LARGE'],
      },
    ],
    eligibilityCriteria: [
      {
        type: String,
      },
    ],
    eligibilityRules: {
      minMachineryCostCrores: {
        type: Number,
        default: 0,
      },
      maxMachineryCostCrores: {
        type: Number,
      },
      minPowerLoadHp: {
        type: Number,
        default: 0,
      },
      maxPowerLoadHp: {
        type: Number,
      },
      applicableDistricts: [String],
    },
    fileName: {
      type: String,
    },
    policyDocUrl: {
      type: String,
    },
    status: {
      type: String,
      enum: ['PUBLISHED', 'DRAFT', 'EXPIRED', 'ARCHIVED'],
      default: 'PUBLISHED',
      index: true,
    },
    datePublished: {
      type: String,
      default: () => new Date().toISOString().split('T')[0],
    },
    validUntil: {
      type: Date,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const BenefitScheme = mongoose.model('BenefitScheme', benefitSchemeSchema);
export default BenefitScheme;
export { BenefitScheme };
