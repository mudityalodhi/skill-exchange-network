const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Article title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Communication Skills',
        'Coding',
        'Web Development',
        'AI & Technology',
        'Career Guidance',
        'Freelancing',
        'Public Speaking',
        'Productivity',
        'Self Improvement',
        'Mental Health',
        'Design',
        'Marketing',
        'Entrepreneurship',
        'Finance',
        'Interview Preparation',
      ],
    },
    thumbnail: {
      type: String,
      default: '',
    },
    thumbnailCloudId: {
      type: String,
      default: '',
    },
    excerpt: {
      type: String,
      maxlength: [300, 'Excerpt cannot exceed 300 characters'],
      default: '',
    },
    content: {
      type: String,
      required: [true, 'Article content is required'],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tags: [String],
    readTime: {
      type: Number, // in minutes
      default: 5,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    likesCount: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isTrending: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'published',
    },
  },
  { timestamps: true }
);

// Auto-generate slug from title
articleSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 100) + '-' + Date.now();
  }
  if (this.isModified('content')) {
    const wordCount = this.content.split(/\s+/).length;
    this.readTime = Math.max(1, Math.ceil(wordCount / 200));
  }
  next();
});

// Auto-update likesCount
articleSchema.pre('save', function (next) {
  this.likesCount = this.likes.length;
  next();
});

articleSchema.index({ title: 'text', content: 'text', tags: 'text' });
articleSchema.index({ category: 1, isPublished: 1 });
articleSchema.index({ isFeatured: 1, isTrending: 1 });

module.exports = mongoose.model('Article', articleSchema);
