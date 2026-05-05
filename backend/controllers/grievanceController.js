const Grievance = require('../models/Grievance');

<<<<<<< HEAD
=======
// @desc  Create a grievance
// @route POST /api/grievances
>>>>>>> origin/main
const createGrievance = async (req, res) => {
  const { title, description, category, priority, location } = req.body;
  try {
    const grievance = await Grievance.create({
<<<<<<< HEAD
      title, description, category, priority, location,
      submittedBy: req.user._id,
    });
    return res.status(201).json(grievance);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

=======
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
>>>>>>> origin/main
const getGrievances = async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { submittedBy: req.user._id };
    const grievances = await Grievance.find(filter)
      .populate('submittedBy', 'name email')
      .sort({ createdAt: -1 });
<<<<<<< HEAD
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

=======
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
>>>>>>> origin/main
const updateGrievance = async (req, res) => {
  const { status, message } = req.body;
  try {
    const grievance = await Grievance.findById(req.params.id);
    if (!grievance) return res.status(404).json({ message: 'Grievance not found' });
<<<<<<< HEAD
    grievance.status = status || grievance.status;
    if (message) grievance.updates.push({ message, updatedBy: req.user._id });
    const updated = await grievance.save();
    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ message: error.message });
=======

    grievance.status = status || grievance.status;
    if (message) {
      grievance.updates.push({ message, updatedBy: req.user._id });
    }
    const updated = await grievance.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
>>>>>>> origin/main
  }
};

module.exports = { createGrievance, getGrievances, getGrievanceById, updateGrievance };