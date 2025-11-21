import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  profilePicture: {
    type: String,
    default: ''
  },
  coverPicture: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    maxlength: 500,
    default: 'Hello! I am new here.'
  },
  website: String,
  location: String,
  dateOfBirth: Date,
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer-not-to-say']
  },
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }],
  stories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Story'
  }],
  isVerified: {
    type: Boolean,
    default: false
  },
  isOnline: {
    type: Boolean,
    default: false
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },
  privacy: {
    profile: {
      type: String,
      enum: ['public', 'private', 'friends'],
      default: 'public'
    },
    messages: {
      type: String,
      enum: ['everyone', 'friends', 'none'],
      default: 'everyone'
    }
  },
  subscription: {
    type: {
      type: String,
      enum: ['free', 'premium', 'pro'],
      default: 'free'
    },
    expiresAt: Date
  },
  blockedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  loginHistory: [{
    ip: String,
    device: String,
    location: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

export default mongoose.model('User', userSchema);