const Grievance = require('../models/Grievance');

// @desc  Create a grievance
// @route POST /api/grievances
const createGrievance = async (req, res) => {
  const { title, description, category, priority, location } = req.body;
  try {
    const grievance = await Grievance.create({
      title,
      description,
      category,
      priority,
      location,
      submittedBy: req.user._id,
    });
    res.status(201).json(grievance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get all grievances (admin) or own grievances (citizen)
// @route GET /api/grievances
const getGrievances = async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { submittedBy: req.user._id };
    const grievances = await Grievance.find(filter)
      .populate('submittedBy', 'name email')
      .sort({ createdAt: -1 });
    res.json(grievances);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get single grievance by ID or tracking ID
// @route GET /api/grievances/:id
const getGrievanceById = async (req, res) => {
  try {
    const grievance = await Grievance.findOne({
      $or: [{ _id: req.params.id }, { trackingId: req.params.id }],
    }).populate('submittedBy', 'name email').populate('assignedTo', 'name email');

    if (!grievance) return res.status(404).json({ message: 'Grievance not found' });
    res.json(grievance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Update grievance status (admin/officer)
// @route PUT /api/grievances/:id
const updateGrievance = async (req, res) => {
  const { status, message } = req.body;
  try {
    const grievance = await Grievance.findById(req.params.id);
    if (!grievance) return res.status(404).json({ message: 'Grievance not found' });

    grievance.status = status || grievance.status;
    if (message) {
      grievance.updates.push({ message, updatedBy: req.user._id });
    }
    const updated = await grievance.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createGrievance, getGrievances, getGrievanceById, updateGrievance };