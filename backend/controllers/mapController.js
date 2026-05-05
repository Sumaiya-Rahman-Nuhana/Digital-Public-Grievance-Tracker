const Grievance = require('../models/Grievance');

// @desc  Get all grievances with coordinates for map
// @route GET /api/map/markers
const getMapMarkers = async (req, res) => {
  try {
    const grievances = await Grievance.find({
      'location.coordinates.lat': { $exists: true, $ne: null },
      'location.coordinates.lng': { $exists: true, $ne: null },
    })
      .select('title category status priority location createdAt trackingId submittedBy')
      .populate('submittedBy', 'name')
      .sort({ createdAt: -1 });

    return res.json(grievances);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc  Get area-based statistics
// @route GET /api/map/stats
const getAreaStats = async (req, res) => {
  try {
    const total = await Grievance.countDocuments();
    const resolved = await Grievance.countDocuments({ status: 'resolved' });
    const pending = await Grievance.countDocuments({ status: 'pending' });
    const inProgress = await Grievance.countDocuments({ status: 'in-progress' });
    const rejected = await Grievance.countDocuments({ status: 'rejected' });

    // Overdue = pending for more than 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const overdue = await Grievance.countDocuments({
      status: { $in: ['pending', 'in-progress'] },
      createdAt: { $lt: sevenDaysAgo },
    });

    // Category breakdown
    const categoryStats = await Grievance.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Status breakdown per category
    const categoryStatusStats = await Grievance.aggregate([
      { $group: { _id: { category: '$category', status: '$status' }, count: { $sum: 1 } } },
      { $sort: { '_id.category': 1 } },
    ]);

    // Monthly trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const monthlyTrend = await Grievance.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
          resolved: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // Priority breakdown
    const priorityStats = await Grievance.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } },
    ]);

    // Resolution rate
    const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

    // Average resolution time (days)
    const resolvedGrievances = await Grievance.find({ status: 'resolved' })
      .select('createdAt updatedAt');
    let avgResolutionDays = 0;
    if (resolvedGrievances.length > 0) {
      const totalDays = resolvedGrievances.reduce((sum, g) => {
        return sum + (new Date(g.updatedAt) - new Date(g.createdAt)) / (1000 * 60 * 60 * 24);
      }, 0);
      avgResolutionDays = Math.round(totalDays / resolvedGrievances.length);
    }

    return res.json({
      overview: { total, resolved, pending, inProgress, rejected, overdue, resolutionRate, avgResolutionDays },
      categoryStats,
      categoryStatusStats,
      monthlyTrend,
      priorityStats,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { getMapMarkers, getAreaStats };