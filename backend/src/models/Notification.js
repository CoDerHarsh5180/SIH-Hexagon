import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    role: {
      type: String,
      enum: ['USER', 'LOCAL_AUTH', 'MAIN_AUTH', 'ALL'],
      default: 'USER',
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Notification title is required'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Notification message is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['INFO', 'WARNING', 'SUCCESS', 'ALERT', 'SLA_BREACH', 'PAYMENT', 'INSPECTION', 'DISCREPANCY', 'SYSTEM'],
      default: 'INFO',
      index: true,
    },
    link: {
      type: String,
      default: '',
    },
    referenceId: {
      type: String,
      index: true,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    readAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
export { Notification };
