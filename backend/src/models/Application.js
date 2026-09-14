import mongoose from 'mongoose';

const uploadedFileSchema = new mongoose.Schema(
  {
    documentId: String,
    documentName: String,
    documentType: String,
    fileUrl: {
      type: String,
      required: true,
    },
    fileName: String,
    fileSize: Number,
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
    verificationStatus: {
      type: String,
      enum: ['PENDING', 'VERIFIED', 'REJECTED'],
      default: 'PENDING',
    },
    remarks: String,
  },
  { _id: true }
);

const discrepancyResponseSchema = new mongoose.Schema(
  {
    remarks: String,
    respondedAt: {
      type: Date,
      default: Date.now,
    },
    uploadedFiles: [
      {
        documentType: String,
        fileUrl: String,
        fileName: String,
      },
    ],
  },
  { _id: false }
);

const discrepancySchema = new mongoose.Schema(
  {
    raisedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    officerName: String,
    raisedAt: {
      type: Date,
      default: Date.now,
    },
    remarks: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['OPEN', 'RESOLVED'],
      default: 'OPEN',
    },
    response: discrepancyResponseSchema,
  },
  { _id: true }
);

const applicationSchema = new mongoose.Schema(
  {
    applicationId: {
      type: String,
      required: [true, 'Application ID is required'],
      unique: true,
      trim: true,
      index: true, // e.g. "APP-MH-2026-89412"
    },
    verificationCode: {
      type: String,
      required: [true, 'Verification code is required for public lookup'],
      trim: true,
      index: true, // 6-digit security code for public tracking lookup
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    // Clearance / Approval Reference
    approvalId: {
      type: String,
      required: [true, 'Approval ID is required'],
      index: true, // e.g. "appr-01", "DOC-MPCB-001"
    },
    approvalTitle: {
      type: String,
      required: [true, 'Approval title is required'],
    },
    title: {
      type: String, // fallback alias for approvalTitle
    },
    authority: {
      type: String,
      required: [true, 'Authority is required'],
      index: true, // e.g. "Maharashtra Pollution Control Board (MPCB)"
    },
    department: {
      type: String,
    },
    district: {
      type: String,
      required: [true, 'District is required'],
      index: true, // e.g. "Aurangabad", "Pune"
    },
    isCustomApplication: {
      type: Boolean,
      default: false,
    },
    // Application Lifecycle Status
    status: {
      type: String,
      enum: [
        'DRAFT',
        'SUBMITTED',
        'UNDER_SCRUTINY',
        'DISCREPANCY_RAISED',
        'DISCREPANCY_RESOLVED',
        'PAYMENT_PENDING',
        'FEE_PAID',
        'INSPECTION_SCHEDULED',
        'INSPECTION_COMPLETED',
        'RECOMMENDED_FOR_APPROVAL',
        'APPROVED',
        'REJECTED',
        'WITHDRAWN',
      ],
      default: 'SUBMITTED',
      index: true,
    },
    currentStage: {
      type: String,
      enum: [
        'APPLICATION_SUBMITTED',
        'DOCUMENT_SCRUTINY',
        'FEE_PAYMENT',
        'FIELD_INSPECTION',
        'CENTRAL_REVIEW',
        'FINAL_APPROVAL',
        'CERTIFICATE_ISSUED',
        'REJECTED',
        'WITHDRAWN',
      ],
      default: 'APPLICATION_SUBMITTED',
    },
    submissionDate: {
      type: Date,
      default: Date.now,
    },
    // Fee Payment details
    feeAmount: {
      type: Number,
      default: 0,
    },
    feePaid: {
      type: Number,
      default: 0,
    },
    paymentDetails: {
      isPaid: {
        type: Boolean,
        default: false,
      },
      utrNumber: {
        type: String,
        trim: true,
      },
      amount: {
        type: Number,
        default: 0,
      },
      paymentMethod: {
        type: String,
        enum: ['UPI', 'NEFT', 'RTGS', 'CARD', 'NET_BANKING', 'DEMAND_DRAFT'],
        default: 'UPI',
      },
      paidAt: {
        type: Date,
      },
      receiptUrl: {
        type: String,
      },
      paymentStatus: {
        type: String,
        enum: ['PENDING', 'VERIFIED', 'FAILED'],
        default: 'PENDING',
      },
    },
    // Uploaded Documents Dossier
    uploadedDocuments: [uploadedFileSchema],
    // Discrepancy Tracking
    discrepancies: [discrepancySchema],
    // Scrutiny Decision by Local Authority
    scrutiny: {
      scrutinizedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      officerName: String,
      scrutinyDate: Date,
      decision: {
        type: String,
        enum: ['APPROVED', 'REJECTED', 'DISCREPANCY'],
      },
      signedDocId: String, // e.g. "DSC-TOKEN-AUR-8821"
      rejectionReason: String, // e.g. "Non-compliance with setback distance"
      remarks: String,
    },
    // Field Inspection
    inspection: {
      inspectionId: String,
      scheduledDate: String, // e.g. "2026-09-24"
      inspectionTime: String, // e.g. "11:00 AM"
      inspectorName: String, // e.g. "Anand Patil"
      inspectorContact: String, // e.g. "+91 22 2757 4410"
      inspectorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      instructions: String, // e.g. "Ensure site engineer and blueprint are available."
      status: {
        type: String,
        enum: ['NOT_REQUIRED', 'PENDING_SCHEDULE', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'PASSED', 'FAILED', 'CANCELLED'],
        default: 'NOT_REQUIRED',
      },
      report: {
        inspectionDate: String,
        inspectorName: String,
        findings: String, // e.g. "All safety equipment verified"
        status: {
          type: String,
          enum: ['PASSED', 'FAILED', 'CONDITIONAL'],
        },
        reportFileUrl: String,
        submittedAt: Date,
      },
    },
    // Central Authority Sanction / Remittance (Main Authority)
    centralApproval: {
      sanctionId: String,
      signedDocId: String, // e.g. "IAS-SANCTION-MH-2026-901"
      action: {
        type: String,
        enum: ['APPROVED', 'REJECTED'],
      },
      rejectionReason: String, // e.g. "Violation of Coastal Regulation Zone guidelines"
      grounds: String, // e.g. "Environment Protection Act Section 5"
      remarks: String,
      approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      officerName: String,
      processedAt: Date,
    },
    // Application Withdrawal
    withdrawal: {
      isWithdrawn: {
        type: Boolean,
        default: false,
      },
      reason: String, // e.g. "Project relocation"
      withdrawnAt: Date,
    },
    // SLA & Escalation Pipeline
    sla: {
      slaDays: {
        type: Number,
        default: 30,
      },
      slaDeadline: Date,
      isBreached: {
        type: Boolean,
        default: false,
      },
      isEscalated: {
        type: Boolean,
        default: false,
      },
      escalations: [
        {
          escalatedAt: {
            type: Date,
            default: Date.now,
          },
          remarks: String, // e.g. "Clearance duration exceeded statutory timeline."
          escalatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
          },
          status: {
            type: String,
            enum: ['OPEN', 'UNDER_INVESTIGATION', 'RESOLVED'],
            default: 'OPEN',
          },
          resolution: String,
          resolvedAt: Date,
        },
      ],
    },
    // Digital Certificate Issued
    issuedCertificate: {
      certificateNumber: String,
      certificateUrl: String,
      issueDate: Date,
      expiryDate: Date,
      validityYears: Number,
      digitalSignature: String,
      signedDocId: String,
    },
    // Full Audit Trail
    auditTrail: [
      {
        stage: String,
        action: String,
        actor: String,
        actorRole: String,
        actorId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        remarks: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Auto-populate title if missing and approvalTitle exists
applicationSchema.pre('save', function () {
  if (!this.title && this.approvalTitle) {
    this.title = this.approvalTitle;
  }
  if (!this.approvalTitle && this.title) {
    this.approvalTitle = this.title;
  }

  // Calculate SLA deadline if not set
  if (this.isNew && !this.sla.slaDeadline) {
    const days = this.sla.slaDays || 30;
    const deadline = new Date(this.submissionDate || Date.now());
    deadline.setDate(deadline.getDate() + days);
    this.sla.slaDeadline = deadline;
  }
});

const Application = mongoose.model('Application', applicationSchema);
export default Application;
export { Application };
