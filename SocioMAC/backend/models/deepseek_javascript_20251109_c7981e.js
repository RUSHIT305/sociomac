import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    maxlength: 2000
  },
  images: [{
    url: String,
    publicId: String,
    thumbnail: String
  }],
  videos: [{
    url: String,
    publicId: String,
    thumbnail: String,
    duration: Number
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    text: {
      type: String,
      required: true,
      maxlength: 1000
    },
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    replies: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      text: {
        type: String,
        required: true,
        maxlength: 500
      },
      likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }],
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  shares: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    sharedAt: {
      type: Date,
      default: Date.now
    }
  }],
  tags: [String],
  location: {
    name: String,
    coordinates: {
      type: [Number],
      index: '2dsphere'
    }
  },
  privacy: {
    type: String,
    enum: ['public', 'friends', 'private'],
    default: 'public'
  },
  isSponsored: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  engagement: {
    score: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

export default mongoose.model('Post', postSchema);