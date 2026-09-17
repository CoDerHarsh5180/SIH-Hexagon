import mongoose from 'mongoose';

const evaluationHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    // Enterprise input parameters
    sector: {
      type: String,
      required: [true, 'Industry sector is required'],
      trim: true,
    },
    subSector: {
      type: String,
      trim: true,
    },
    enterpriseScale: {
      type: String,
      enum: ['MICRO', 'SMALL', 'MEDIUM', 'LARGE'],
      required: [true, 'Enterprise scale is required'],
    },
    district: {
      type: String,
      required: [true, 'District is required'],
      trim: true,
    },
    landType: {
      type: String,
      required: [true, 'Land Type is required'],
    },
    plotAreaSqM: {
      type: Number,
      default: 0,
    },
    builtUpAreaSqM: {
      type: Number,
      default: 0,
    },
    connectedPowerLoadKW: {
      type: Number,
      default: 0,
    },
    dailyWaterConsumptionKLD: {
      type: Number,
      default: 0,
    },
    hasBoiler: {
      type: Boolean,
      default: false,
    },
    hasDGSet: {
      type: Boolean,
      default: false,
    },
    generatesHazardousWaste: {
      type: Boolean,
      default: false,
    },
    pollutionTier: {
      type: String,
      default: 'Orange',
    },
    projectNature: {
      type: String,
      default: 'greenfield',
    },
    constitution: {
      type: String,
      default: 'Private Limited Company',
    },
    hasNaOrder: {
      type: Boolean,
      default: true,
    },
    waterSource: {
      type: String,
      default: 'MIDC Piped Water Network',
    },
    storesFlammableSolvents: {
      type: Boolean,
      default: false,
    },
    isFoodProduct: {
      type: Boolean,
      default: false,
    },
    isExportOriented: {
      type: Boolean,
      default: false,
    },
    buildingHeight: {
      type: String,
      default: 'Under 15 Meters (Standard)',
    },
    totalCapitalInvestmentInr: {
      type: Number,
      default: 0,
    },
    workforceCount: {
      type: Number,
      default: 0,
    },
    // Evaluation Results
    recommendedApprovals: [
      {
        approvalId: String,
        title: String,
        department: String,
        category: String,
        fee: Number,
        slaDays: Number,
        isMandatory: Boolean,
        requiresInspection: Boolean,
      },
    ],
    totalEstimatedFees: {
      type: Number,
      default: 0,
    },
    maxSlaDays: {
      type: Number,
      default: 30,
    },
    totalClearancesCount: {
      type: Number,
      default: 0,
    },
    evaluatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const EvaluationHistory = mongoose.model('EvaluationHistory', evaluationHistorySchema);
export default EvaluationHistory;
export { EvaluationHistory };
