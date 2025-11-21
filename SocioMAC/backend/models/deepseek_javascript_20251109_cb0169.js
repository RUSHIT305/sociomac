import mongoose from 'mongoose';

const storySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    maxlength: 500
  },
  media: {
    type: {
      type: String,
      enum: ['image', 'video'],
      required: true
    },
    url: {
      type: String,
      required: true
    },
    thumbnail: String,
    duration: Number
  },
  views: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    viewedAt: {
      type: Date,
      default: Date.now
    }
  }],
  reactions: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    type: {
      type: String,
      enum: ['like', 'love', 'laugh', 'surprise', 'sad'],
      default: 'like'
    }
  }],
  expiresAt: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 }
  },
  privacy: {
    type: String,
    enum: ['public', 'friends', 'close-friends'],
    default: 'public'
  },
  location: {
    name: String
  },
  hashtags: [String],
  mentions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

storySchema.pre('save', function(next) {
  if (!this.expiresAt) {
    this.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  }
  next();
});

export default mongoose.model('Story', storySchema);