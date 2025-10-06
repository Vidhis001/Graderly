import express from 'express';
import mongoose from 'mongoose';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

const questionSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    referenceAnswer: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

const Question = mongoose.models.Question || mongoose.model('Question', questionSchema);

router.post('/', requireAuth, requireRole('teacher'), async (req, res) => {
  try {
    console.log('Creating question:', req.body);
    console.log('User:', req.user);
    
    const { text, referenceAnswer } = req.body;
    if (!text || !referenceAnswer) {
      console.log('Missing fields:', { text: !!text, referenceAnswer: !!referenceAnswer });
      return res.status(400).json({ message: 'Missing fields: text and referenceAnswer are required' });
    }
    
    const q = await Question.create({ text, referenceAnswer, createdBy: req.user.sub });
    console.log('Question created:', q);
    return res.status(201).json(q);
  } catch (err) {
    console.error('Error creating question:', err);
    return res.status(500).json({ message: `Server error: ${err.message}` });
  }
});

router.get('/', requireAuth, async (_req, res) => {
  const list = await Question.find().sort({ createdAt: -1 });
  return res.json(list);
});

export default router;


