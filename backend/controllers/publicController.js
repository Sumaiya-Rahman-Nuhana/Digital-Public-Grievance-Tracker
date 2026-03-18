const Grievance = require('../models/Grievance');

const getPublicFeed = async (req, res) => {
  try {
    const { sort = 'latest', category, status } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;
    let sortOption = {};
    if (sort === 'latest') sortOption = { createdAt: -1 };
    else if (sort === 'unresolved') sortOption = { createdAt: 1 };
    else if (sort === 'upvotes') sortOption = { upvotes: -1 };
    const grievances = await Grievance.find(filter)
      .select('title category status priority location createdAt upvotes trackingId submittedBy')
      .populate('submittedBy', 'name')
      .sort(sortOption)
      .limit(50);
    return res.json(grievances);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { getPublicFeed };