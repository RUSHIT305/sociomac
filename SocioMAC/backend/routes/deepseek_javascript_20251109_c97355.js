import express from 'express';
import auth from '../middleware/auth.js';
import Story from '../models/Story.js';
import User from '../models/User.js';

const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const { content, media, privacy } = req.body;

    const story = new Story({
      user: req.user.id,
      content,
      media,
      privacy: privacy || 'public'
    });

    await story.save();
    await story.populate('user', 'username profilePicture');

    res.status(201).json(story);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/feed', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const stories = await Story.find({
      $or: [
        { user: req.user.id },
        { user: { $in: user.following } }
      ],
      expiresAt: { $gt: new Date() }
    })
    .populate('user', 'username profilePicture')
    .sort({ createdAt: -1 });

    res.json(stories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id/view', auth, async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    if (!story.views.some(view => view.user.toString() === req.user.id)) {
      story.views.push({ user: req.user.id });
      await story.save();
    }

    res.json({ message: 'Story viewed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;