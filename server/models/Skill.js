const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Skill title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Technology',
        'Design',
        'Business',
        'Marketing',
        'Music',
        'Art',
        'Language',
        'Writing',
        'Photography',
        'Cooking',
        'Fitness',
        'Finance',
        'Education',
        'Other',
      ],
    },
    description: {
      type: String,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: '',
    },
    icon: {
      type: String,
      default: '🎯',
    },
    tags: [String],
    usersOffering: {
      type: Number,
      default: 0,
    },
    usersWanting: {
      type: Number,
      default: 0,
    },
    isApproved: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

skillSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Skill', skillSchema);
