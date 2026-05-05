const Grievance = require('../models/Grievance');

<<<<<<< HEAD
const getPublicFeed = async (req, res) => {
  try {
    const { sort = 'latest', category, status } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;
=======
// @desc  Get public complaint feed (no auth required)
// @route GET /api/public/feed
const getPublicFeed = async (req, res) => {
  try {
    const { sort = 'latest', category, status } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;

>>>>>>> origin/main
    let sortOption = {};
    if (sort === 'latest') sortOption = { createdAt: -1 };
    else if (sort === 'unresolved') sortOption = { createdAt: 1 };
    else if (sort === 'upvotes') sortOption = { upvotes: -1 };
<<<<<<< HEAD
=======

>>>>>>> origin/main
    const grievances = await Grievance.find(filter)
      .select('title category status priority location createdAt upvotes trackingId submittedBy')
      .populate('submittedBy', 'name')
      .sort(sortOption)
      .limit(50);
<<<<<<< HEAD
    return res.json(grievances);
  } catch (error) {
    return res.status(500).json({ message: error.message });
=======

    res.json(grievances);
  } catch (error) {
    res.status(500).json({ message: error.message });
>>>>>>> origin/main
  }
};

module.exports = { getPublicFeed };