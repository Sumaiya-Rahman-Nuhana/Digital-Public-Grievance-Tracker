const express = require('express');
const router = express.Router();
const Department = require('../models/Department');

const CATEGORY_DEPARTMENT_MAP = {
  'Roads':       'City Corporation',
  'Water':       'WASA',
  'Electricity': 'DESCO/DPDC',
  'Health':      'Health Department',
  'Education':   'Education Board',
  'Sanitation':  'City Corporation'
};

router.get('/', async (req, res) => {
  try {
    const departments = await Department.find()
      .sort({ resolvedComplaints: -1 });
    res.json(departments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/leaderboard', async (req, res) => {
  try {
    const departments = await Department.find({
      totalComplaints: { $gt: 0 }
    });

    const ranked = departments.map(dept => ({
      name: dept.name,
      totalComplaints: dept.totalComplaints,
      resolvedComplaints: dept.resolvedComplaints,
      resolutionRate: dept.totalComplaints > 0
        ? ((dept.resolvedComplaints / dept.totalComplaints) * 100).toFixed(1)
        : 0,
      avgResolutionTime: dept.avgResolutionTime
    })).sort((a, b) => b.resolutionRate - a.resolutionRate);

    res.json({
      mostResponsive: ranked.slice(0, 3),
      mostIgnored: [...ranked].reverse().slice(0, 3)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/assign/:category', (req, res) => {
  const dept = CATEGORY_DEPARTMENT_MAP[req.params.category];
  if (!dept) return res.status(404).json({ message: 'No department found' });
  res.json({ department: dept });
});

router.post('/seed', async (req, res) => {
  try {
    const unique = [...new Set(Object.values(CATEGORY_DEPARTMENT_MAP))];
    const depts = unique.map(name => ({ name }));
    await Department.insertMany(depts, { ordered: false }).catch(() => {});
    res.json({ message: 'Departments seeded!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;