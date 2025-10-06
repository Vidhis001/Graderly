import express from 'express';
import mongoose from 'mongoose';
import fetch from 'node-fetch';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

const answerSchema = new mongoose.Schema(
  {
    question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    score: { type: Number },
    category: { type: String },
    feedback: { type: String }
  },
  { timestamps: true }
);

const Answer = mongoose.models.Answer || mongoose.model('Answer', answerSchema);

router.post('/', requireAuth, async (req, res) => {
  try {
    const { questionId, text, override } = req.body;
    if (!questionId || !text) return res.status(400).json({ message: 'Missing fields' });

    // Optionally allow teacher to override score directly
    if (override && (override.score !== undefined || override.category)) {
      const a = await Answer.create({ question: questionId, student: req.user.sub, text, ...override });
      return res.status(201).json(a);
    }

    // Call ML service
    const mlUrl = process.env.ML_SERVICE_URL || 'http://localhost:8000';
    // Fetch question and reference answer
    const Question = mongoose.models.Question;
    const q = await Question.findById(questionId);
    if (!q) return res.status(404).json({ message: 'Question not found' });

    const resp = await fetch(`${mlUrl}/grade`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question: q.text,
        reference_answer: q.referenceAnswer,
        student_answer: text
      })
    });
    if (!resp.ok) return res.status(502).json({ message: 'ML service error' });
    const result = await resp.json();

    const a = await Answer.create({
      question: questionId,
      student: req.user.sub,
      text,
      score: result.score,
      category: result.category
    });
    return res.status(201).json(a);
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

router.get('/mine', requireAuth, async (req, res) => {
  const list = await Answer.find({ student: req.user.sub }).sort({ createdAt: -1 }).populate('question');
  return res.json(list);
});

router.patch('/:id/override', requireAuth, async (req, res) => {
  try {
    const { score, category, feedback } = req.body;
    const a = await Answer.findByIdAndUpdate(
      req.params.id,
      { $set: { score, category, feedback } },
      { new: true }
    );
    if (!a) return res.status(404).json({ message: 'Not found' });
    return res.json(a);
  } catch {
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;


