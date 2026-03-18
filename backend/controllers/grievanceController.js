const Grievance = require('../models/Grievance');

const createGrievance = async (req, res) => {
  const { title, description, category, priority, location } = req.body;
  try {
    const grievance = await Grievance.create({
      title, description, category, priority, location,
      submittedBy: req.user._id,
    });
    return res.status(201).json(grievance);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getGrievances = async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { submittedBy: req.user._id };
    const grievances = await Grievance.find(filter)
      .populate('submittedBy', 'name email')
      .sort({ createdAt: -1 });
    return res.json(grievances);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getGrievanceById = async (req, res) => {
  try {
    const grievance = await Grievance.findOne({
      $or: [
        { _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null },
        { trackingId: req.params.id }
      ],
    }).populate('submittedBy', 'name email').populate('assignedTo', 'name email');
    if (!grievance) return res.status(404).json({ message: 'Grievance not found' });
    return res.json(grievance);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateGrievance = async (req, res) => {
  const { status, message } = req.body;
  try {
    const grievance = await Grievance.findById(req.params.id);
    if (!grievance) return res.status(404).json({ message: 'Grievance not found' });
    grievance.status = status || grievance.status;
    if (message) grievance.updates.push({ message, updatedBy: req.user._id });
    const updated = await grievance.save();
    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { createGrievance, getGrievances, getGrievanceById, updateGrievance };