import mongoose from 'mongoose';

const requiredDocSchema = new mongoose.Schema(
  {
    documentName: {
      type: String,
      required: true,
      trim: true,
    },
    isMandatory: {
      type: Boolean,
      default: true,
    },
    category: {
      type: String,
      enum: ['LAND', 'ENVIRONMENT', 'LEGAL', 'IDENTITY', 'FINANCIAL', 'TECHNICAL', 'CLEARANCE', 'CERTIFICATE', 'OTHER'],
      default: 'OTHER',
    },
    description: {
      type: String,
      default: '',
    },
  },
  { _id: false }
);

const approvalCatalogSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: [true, 'Approval/Document ID is required'],
      unique: true,
      trim: true,
      index: true, // e.g. "DOC-AUTH-1024", "DOC-MPCB-001", "appr-01"
    },
    title: {
      type: String,
      required: [true, 'Approval Title is required'],
      trim: true,
    },
    category: {
      type: String,
      default: 'Industrial Clearance',
      trim: true,
      index: true,
    },
    department: {
      type: String,
      trim: true,
      default: 'General Regulatory Body',
    },
    authority: {
      type: String,
      trim: true,
      default: 'General Regulatory Body',
    },
    authorityBody: {
      type: String,
      trim: true,
    },
    district: {
      type: String,
      default: 'ALL',
      index: true,
    },
    slaDays: {
      type: Number,
      required: [true, 'SLA timeline in days is required'],
      default: 30,
      min: 1,
    },
    fee: {
      type: Number,
      required: [true, 'Statutory Fee is required'],
      default: 0,
      min: 0,
    },
    description: {
      type: String,
      default: '',
    },
    requiredDocs: [
      {
        type: mongoose.Schema.Types.Mixed, // Supports array of Strings or Subdocument objects
      },
    ],
    requiresInspection: {
      type: Boolean,
      default: false,
    },
    inspectionTiming: {
      type: String,
      default: 'Before Approval Issuance',
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'DRAFT', 'PUBLISHED', 'ARCHIVED'],
      default: 'ACTIVE',
      index: true,
    },
    type: {
      type: String,
      enum: ['CLEARANCE', 'SCHEME', 'MASTER_DOC'],
      default: 'CLEARANCE',
    },
    // Evaluation rules engine triggers
    rules: {
      applicableSectors: [String],
      applicableScales: [{ type: String, enum: ['MICRO', 'SMALL', 'MEDIUM', 'LARGE'] }],
      applicablePollutionTiers: [{ type: String, enum: ['White', 'Green', 'Orange', 'Red'] }],
      applicableLandTypes: [String],
      minPowerLoadKW: { type: Number, default: 0 },
      minWaterConsumptionKLD: { type: Number, default: 0 },
      requiresBoiler: { type: Boolean, default: false },
      requiresDGSet: { type: Boolean, default: false },
      requiresHazardousWaste: { type: Boolean, default: false },
      minCapitalInvestmentInr: { type: Number, default: 0 },
      minWorkforceCount: { type: Number, default: 0 },
    },
    validityYears: {
      type: Number,
      default: 5,
    },
    sampleDocumentUrl: {
      type: String,
      default: '',
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

const ApprovalCatalog = mongoose.model('ApprovalCatalog', approvalCatalogSchema);
export default ApprovalCatalog;
export { ApprovalCatalog };
