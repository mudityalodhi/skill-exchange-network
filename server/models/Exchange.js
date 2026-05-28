const mongoose = require('mongoose');

const exchangeSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    skillOffered: {
      type: String,
      required: [true, 'Skill offered is required'],
    },
    skillWanted: {
      type: String,
      required: [true, 'Skill wanted is required'],
    },
    message: {
      type: String,
      maxlength: [500, 'Message cannot exceed 500 characters'],
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
      default: 'pending',
    },
    creditCost: {
      type: Number,
      default: 10,
      min: 0,
    },
    sessionDetails: {
      scheduledDate: Date,
      duration: { type: Number, default: 60 }, // in minutes
      platform: {
        type: String,
        enum: ['Zoom', 'Google Meet', 'Discord', 'Other'],
        default: 'Google Meet',
      },
      meetingLink: String,
      notes: String,
    },
    completedAt: Date,
    cancelledAt: Date,
    cancelReason: String,
    senderReviewed: { type: Boolean, default: false },
    receiverReviewed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

exchangeSchema.index({ sender: 1, status: 1 });
exchangeSchema.index({ receiver: 1, status: 1 });

module.exports = mongoose.model('Exchange', exchangeSchema);
