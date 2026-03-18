const express = require('express');
const router = express.Router();
const {
  createGrievance,
  getGrievances,
  getGrievanceById,
  updateGrievance,
} = require('../controllers/grievanceController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.route('/').get(protect, getGrievances).post(protect, createGrievance);
router.route('/:id').get(protect, getGrievanceById).put(protect, updateGrievance);

router.put('/:id/upvote', protect, async (req, res) => {
  const grievance = await Grievance.findById(req.params.id);
  if (!grievance) return res.status(404).json({ message: 'Not found' });
  const alreadyUpvoted = grievance.upvotedBy.includes(req.user._id);
  if (alreadyUpvoted) {
    grievance.upvotes -= 1;
    grievance.upvotedBy = grievance.upvotedBy.filter(id => id.toString() !== req.user._id.toString());
  } else {
    grievance.upvotes += 1;
    grievance.upvotedBy.push(req.user._id);
  }
  await grievance.save();
  res.json({ upvotes: grievance.upvotes });
});

module.exports = router;