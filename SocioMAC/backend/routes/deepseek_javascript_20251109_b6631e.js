import express from 'express';
import auth from '../middleware/auth.js';
import Message from '../models/Message.js';
import User from '../models/User.js';

const router = express.Router();

router.get('/messages/:userId', auth, async (req, res) => {
  try {
    const chatId = [req.user.id, req.params.userId].sort().join('_');
    
    const messages = await Message.find({ chatId })
      .populate('sender', 'username profilePicture')
      .populate('receiver', 'username profilePicture')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/messages', auth, async (req, res) => {
  try {
    const { receiverId, text, image } = req.body;
    const chatId = [req.user.id, receiverId].sort().join('_');

    const message = new Message({
      sender: req.user.id,
      receiver: receiverId,
      text,
      image,
      chatId
    });

    await message.save();
    await message.populate('sender', 'username profilePicture');
    await message.populate('receiver', 'username profilePicture');

    res.status(201).json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/conversations', auth, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ sender: req.user.id }, { receiver: req.user.id }]
    })
    .populate('sender', 'username profilePicture')
    .populate('receiver', 'username profilePicture')
    .sort({ createdAt: -1 });

    const conversations = {};
    messages.forEach(message => {
      const otherUser = message.sender._id.toString() === req.user.id ? 
        message.receiver : message.sender;
      
      const conversationId = otherUser._id.toString();
      
      if (!conversations[conversationId]) {
        conversations[conversationId] = {
          user: otherUser,
          lastMessage: message,
          unreadCount: 0
        };
      }
    });

    res.json(Object.values(conversations));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;