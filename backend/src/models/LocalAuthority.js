import mongoose from 'mongoose';

const localAuthoritySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Officer name is required'],
      trim: true,
    },
    designation: {
      type: String,
      required: [true, 'Designation is required'],
      trim: true,
    },
    body: {
      type: String,
      required: [true, 'Authority body is required'],
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
    district: {
      type: String,
      required: [true, 'District jurisdiction is required'],
      trim: true,
      index: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Official email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    employeeId: {
      type: String,
      trim: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'ON_LEAVE'],
      default: 'ACTIVE',
      index: true,
    },
    assignedApplicationsCount: {
      type: Number,
      default: 0,
    },
    resolvedCount: {
      type: Number,
      default: 0,
    },
    averageResolutionDays: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-sync authorityBody and body
localAuthoritySchema.pre('save', function () {
  if (!this.authorityBody && this.body) {
    this.authorityBody = this.body;
  }
  if (!this.body && this.authorityBody) {
    this.body = this.authorityBody;
  }
});

const LocalAuthority = mongoose.model('LocalAuthority', localAuthoritySchema);
export default LocalAuthority;
export { LocalAuthority };
