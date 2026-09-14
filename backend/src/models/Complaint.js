import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema(
  {
    complaintId: {
      type: String,
      unique: true,
      trim: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    userName: {
      type: String,
      trim: true,
    },
    applicationId: {
      type: String,
      trim: true,
      index: true,
    },
    authority: {
      type: String,
      required: [true, 'Authority is required'],
      trim: true,
      index: true,
    },
    department: {
      type: String,
      trim: true,
    },
    district: {
      type: String,
      trim: true,
    },
    complaintType: {
      type: String,
      required: [true, 'Complaint type is required'],
      trim: true,
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: [
        'OPEN',
        'UNDER_INVESTIGATION',
        'INTERVENED',
        'RESOLVED',
        'RESOLVED_WITH_INSPECTION',
        'CLOSED',
        'REJECTED',
      ],
      default: 'OPEN',
      index: true,
    },
    // Main Authority Apex Intervention
    intervention: {
      action: {
        type: String,
      },
      noticeTimestamp: {
        type: Date,
      },
      intervenedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      officerName: String,
      remarks: String,
    },
    // Local Authority Resolution
    resolution: {
      resolutionText: String,
      status: String,
      resolvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      officerName: String,
      resolvedAt: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate complaintId if not provided
complaintSchema.pre('save', function () {
  if (!this.complaintId) {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(1000 + Math.random() * 9000);
    this.complaintId = `CMP-MH-${timestamp}-${random}`;
  }
});

const Complaint = mongoose.model('Complaint', complaintSchema);
export default Complaint;
export { Complaint };
