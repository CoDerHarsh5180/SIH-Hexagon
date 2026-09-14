import mongoose from 'mongoose';

const querySchema = new mongoose.Schema(
  {
    queryId: {
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
    userEmail: {
      type: String,
      trim: true,
    },
    department: {
      type: String,
      required: [true, 'Department/Authority is required'],
      trim: true,
      index: true,
    },
    district: {
      type: String,
      required: [true, 'District is required'],
      trim: true,
    },
    query: {
      type: String,
      required: [true, 'Query text is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['OPEN', 'IN_PROGRESS', 'ANSWERED', 'CLOSED'],
      default: 'OPEN',
      index: true,
    },
    response: {
      answeredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      officerName: String,
      answer: String,
      answeredAt: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate queryId if not provided
querySchema.pre('save', function () {
  if (!this.queryId) {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(1000 + Math.random() * 9000);
    this.queryId = `QRY-MH-${timestamp}-${random}`;
  }
});

const Query = mongoose.model('Query', querySchema);
export default Query;
export { Query };
