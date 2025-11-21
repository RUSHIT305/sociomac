import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    maxlength: 2000
  },
  image: {
    url: String,
    publicId: String
  },
  read: {
    type: Boolean,
    default: false
  },
  chatId: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Message', messageSchema);