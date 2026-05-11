const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const Grievance = require('../models/Grievance');
const { protect } = require('../middleware/authMiddleware');

// Submit feedback
router.post('/:grievanceId', protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const grievance = await Grievance.findById(req.params.grievanceId);
    if (!grievance) return res.status(404).json({ message: 'Grievance not found' });
    if (grievance.status !== 'resolved') return res.status(400).json({ message: 'Can only rate resolved complaints' });
    if (grievance.submittedBy.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Only the complaint owner can rate' });

    const existing = await Feedback.findOne({ grievance: req.params.grievanceId, submittedBy: req.user._id });
    if (existing) return res.status(400).json({ message: 'You have already submitted feedback' });

    const feedback = await Feedback.create({
      grievance: req.params.grievanceId,
      submittedBy: req.user._id,
      rating, comment
    });
    return res.status(201).json(feedback);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Get feedback for a grievance
router.get('/:grievanceId', async (req, res) => {
  try {
    const feedback = await Feedback.findOne({ grievance: req.params.grievanceId })
      .populate('submittedBy', 'name');
    return res.json(feedback);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;