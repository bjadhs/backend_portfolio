import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Download resume endpoint
router.get('/download', (req, res) => {
  const resumePath = path.join(__dirname, '..', '..', 'BIJAYA_ADHIKARI_Resume_Feb4.pdf');
  
  res.download(resumePath, 'Bijaya_Adhikari_Resume.pdf', (err) => {
    if (err) {
      console.error('Resume download error:', err);
      res.status(500).json({ success: false, message: 'Failed to download resume' });
    }
  });
});

export default router;
