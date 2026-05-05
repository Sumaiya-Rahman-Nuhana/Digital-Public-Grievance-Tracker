const Grievance = require('../models/Grievance');

// @desc  Get priority ranked areas
// @route GET /api/priority/areas
const getPriorityAreas = async (req, res) => {
  try {
    const grievances = await Grievance.find({
      'location.address': { $exists: true, $ne: '' }
    }).select('title category status priority location createdAt upvotes trackingId');

    // Group grievances by area (using address)
    const areaMap = {};

    grievances.forEach((g) => {
      const area = g.location?.address || 'Unknown Area';
      // Extract area name (first part before comma)
      const areaKey = area.split(',')[0].trim() || area;

      if (!areaMap[areaKey]) {
        areaMap[areaKey] = {
          area: areaKey,
          total: 0,
          unresolved: 0,
          resolved: 0,
          inProgress: 0,
          overdue: 0,
          upvotes: 0,
          high: 0,
          medium: 0,
          low: 0,
          categories: {},
          grievances: [],
        };
      }

      const entry = areaMap[areaKey];
      entry.total += 1;
      entry.upvotes += g.upvotes || 0;
      entry.grievances.push(g._id);

      // Count by status
      if (g.status === 'resolved') entry.resolved += 1;
      else if (g.status === 'in-progress') entry.inProgress += 1;
      else entry.unresolved += 1;

      // Count overdue (pending > 7 days)
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      if (g.status === 'pending' && new Date(g.createdAt) < sevenDaysAgo) {
        entry.overdue += 1;
      }

      // Count by priority
      if (g.priority === 'high') entry.high += 1;
      else if (g.priority === 'medium') entry.medium += 1;
      else entry.low += 1;

      // Count by category
      entry.categories[g.category] = (entry.categories[g.category] || 0) + 1;
    });

    // Calculate priority score for each area
    // Formula: (unresolved * 3) + (overdue * 5) + (upvotes * 2) + (high * 4) + (medium * 2) + (inProgress * 1)
    const areas = Object.values(areaMap).map((area) => {
      const score =
        (area.unresolved * 3) +
        (area.overdue * 5) +
        (area.upvotes * 2) +
        (area.high * 4) +
        (area.medium * 2) +
        (area.inProgress * 1);

      const resolutionRate = area.total > 0
        ? Math.round((area.resolved / area.total) * 100)
        : 0;

      const topCategory = Object.entries(area.categories)
        .sort((a, b) => b[1] - a[1])[0]?.[0] || 'other';

      return {
        ...area,
        score,
        resolutionRate,
        topCategory,
        categories: area.categories,
      };
    });

    // Sort by score descending
    areas.sort((a, b) => b.score - a.score);

    return res.json(areas);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { getPriorityAreas };