const express = require('express');
const router = express.Router();
<<<<<<< HEAD
const { createGrievance, getGrievances, getGrievanceById, updateGrievance } = require('../controllers/grievanceController');
=======
const {
  createGrievance,
  getGrievances,
  getGrievanceById,
  updateGrievance,
} = require('../controllers/grievanceController');
>>>>>>> origin/main
const { protect } = require('../middleware/authMiddleware');
const Grievance = require('../models/Grievance');

router.route('/').get(protect, getGrievances).post(protect, createGrievance);

<<<<<<< HEAD
=======
// Public tracking by tracking ID (no auth needed)
>>>>>>> origin/main
router.get('/track/:trackingId', async (req, res) => {
  try {
    const grievance = await Grievance.findOne({ trackingId: req.params.trackingId })
      .populate('submittedBy', 'name')
      .populate('assignedTo', 'name');
    if (!grievance) return res.status(404).json({ message: 'No complaint found with this tracking ID.' });
<<<<<<< HEAD
    return res.json(grievance);
  } catch (error) {
    return res.status(500).json({ message: error.message });
=======
    res.json(grievance);
  } catch (error) {
    res.status(500).json({ message: error.message });
>>>>>>> origin/main
  }
});

router.route('/:id').get(protect, getGrievanceById).put(protect, updateGrievance);

router.put('/:id/upvote', protect, async (req, res) => {
  try {
    const grievance = await Grievance.findById(req.params.id);
    if (!grievance) return res.status(404).json({ message: 'Not found' });
    const alreadyUpvoted = grievance.upvotedBy.includes(req.user._id);
    if (alreadyUpvoted) {
      grievance.upvotes -= 1;
<<<<<<< HEAD
      grievance.upvotedBy = grievance.upvotedBy.filter(id => id.toString() !== req.user._id.toString());
=======
      grievance.upvotedBy = grievance.upvotedBy.filter(
        id => id.toString() !== req.user._id.toString()
      );
>>>>>>> origin/main
    } else {
      grievance.upvotes += 1;
      grievance.upvotedBy.push(req.user._id);
    }
    await grievance.save();
    return res.json({ upvotes: grievance.upvotes });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;