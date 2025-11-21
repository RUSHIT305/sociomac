import express from 'express';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/image', auth, async (req, res) => {
  try {
    // For now, return a mock URL
    // In production, you'd upload to Cloudinary/S3
    const mockImageUrl = `https://picsum.photos/800/600?random=${Date.now()}`;
    
    res.json({
      url: mockImageUrl,
      publicId: `mock_${Date.now()}`
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Upload failed' });
  }
});

export default router;