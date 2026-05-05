const Grievance = require('../models/Grievance');

// @desc  Search and filter grievances
// @route GET /api/search
const searchGrievances = async (req, res) => {
  try {
    const {
      keyword,
      category,
      status,
      priority,
      area,
      dateFrom,
      dateTo,
      sort = 'latest',
      page = 1,
      limit = 10,
    } = req.query;

    // Build filter object
    const filter = {};

    // Keyword search in title and description
    if (keyword && keyword.trim()) {
      filter.$or = [
        { title: { $regex: keyword.trim(), $options: 'i' } },
        { description: { $regex: keyword.trim(), $options: 'i' } },
        { trackingId: { $regex: keyword.trim(), $options: 'i' } },
      ];
    }

    // Category filter
    if (category && category !== 'all') {
      filter.category = category;
    }

    // Status filter
    if (status && status !== 'all') {
      filter.status = status;
    }

    // Priority filter
    if (priority && priority !== 'all') {
      filter.priority = priority;
    }

    // Area filter
    if (area && area.trim()) {
      filter['location.address'] = { $regex: area.trim(), $options: 'i' };
    }

    // Date range filter
    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
      if (dateTo) {
        const endDate = new Date(dateTo);
        endDate.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = endDate;
      }
    }

    // Sort option
    let sortOption = {};
    if (sort === 'latest') sortOption = { createdAt: -1 };
    else if (sort === 'oldest') sortOption = { createdAt: 1 };
    else if (sort === 'upvotes') sortOption = { upvotes: -1 };
    else if (sort === 'priority') sortOption = { priority: -1 };

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [grievances, total] = await Promise.all([
      Grievance.find(filter)
        .populate('submittedBy', 'name')
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum),
      Grievance.countDocuments(filter),
    ]);

    return res.json({
      grievances,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      hasMore: pageNum < Math.ceil(total / limitNum),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { searchGrievances };