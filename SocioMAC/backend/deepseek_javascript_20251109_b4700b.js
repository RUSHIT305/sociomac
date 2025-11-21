import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
});

app.use(helmet());
app.use(compression());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000
});
app.use('/api/', limiter);

app.use(cors({
  origin: process.env.CLIENT_URL || "*",
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Professional Social Media API',
    version: '2.0.0',
    features: [
      'User Authentication',
      'Posts with Images/Videos',
      'Real-time Chat',
      'Video Calls',
      'Stories (24h)',
      'Notifications',
      'Follow System',
      'Monetization Ready'
    ]
  });
});

import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import postRoutes from './routes/posts.js';
import storyRoutes from './routes/stories.js';
import chatRoutes from './routes/chat.js';
import uploadRoutes from './routes/upload.js';

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/upload', uploadRoutes);

const connectedUsers = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('user-online', (userId) => {
    connectedUsers.set(userId, socket.id);
    socket.broadcast.emit('user-status-change', { userId, status: 'online' });
  });

  socket.on('join-chat', (chatId) => {
    socket.join(chatId);
  });

  socket.on('send-message', (data) => {
    socket.to(data.chatId).emit('new-message', data);
  });

  socket.on('typing', (data) => {
    socket.to(data.chatId).emit('user-typing', data);
  });

  socket.on('stop-typing', (data) => {
    socket.to(data.chatId).emit('user-stop-typing', data);
  });

  socket.on('call-user', (data) => {
    const receiverSocketId = connectedUsers.get(data.userToCall);
    if (receiverSocketId) {
      socket.to(receiverSocketId).emit('incoming-call', {
        signal: data.signalData,
        from: data.from,
        name: data.name
      });
    }
  });

  socket.on('answer-call', (data) => {
    const callerSocketId = connectedUsers.get(data.to);
    if (callerSocketId) {
      socket.to(callerSocketId).emit('call-accepted', data.signal);
    }
  });

  socket.on('end-call', (data) => {
    const userSocketId = connectedUsers.get(data.to);
    if (userSocketId) {
      socket.to(userSocketId).emit('call-ended');
    }
  });

  socket.on('disconnect', () => {
    for (let [userId, socketId] of connectedUsers.entries()) {
      if (socketId === socket.id) {
        connectedUsers.delete(userId);
        socket.broadcast.emit('user-status-change', { userId, status: 'offline' });
        break;
      }
    }
    console.log('User disconnected:', socket.id);
  });
});

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/socialmedia')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ MongoDB Error:', err));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Professional Social Media API running on port ${PORT}`);
});

export default app;