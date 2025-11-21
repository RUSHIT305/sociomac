import express from 'express';
import auth from '../middleware/auth.js';
import Post from '../models/Post.js';
import User from '../models/User.js';

const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const { content, images, videos, privacy } = req.body;

    const post = new Post({
      user: req.user.id,
      content,
      images: images || [],
      videos: videos || [],
      privacy: privacy || 'public'
    });

    await post.save();
    await post.populate('user', 'username profilePicture');

    res.status(201).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/feed', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const posts = await Post.find({
      $or: [
        { user: req.user.id },
        { user: { $in: user.following } }
      ]
    })
    .populate('user', 'username profilePicture')
    .populate('comments.user', 'username profilePicture')
    .sort({ createdAt: -1 })
    .limit(20);

    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('user', 'username profilePicture')
      .populate('comments.user', 'username profilePicture')
      .populate('likes', 'username profilePicture');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.likes.includes(req.user.id)) {
      post.likes = post.likes.filter(like => like.toString() !== req.user.id);
    } else {
      post.likes.push(req.user.id);
    }

    await post.save();
    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/:id/comment', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const { text } = req.body;

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = {
      user: req.user.id,
      text
    };

    post.comments.push(comment);
    await post.save();
    
    await post.populate('comments.user', 'username profilePicture');
    const newComment = post.comments[post.comments.length - 1];

    res.json(newComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;