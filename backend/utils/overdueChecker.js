const Grievance = require('../models/Grievance');

const checkOverdueComplaints = async () => {
  try {
    const grievances = await Grievance.find({
      status: { $in: ['Reported', 'Acknowledged', 'In Progress'] }
    });

    for (const grievance of grievances) {
      const daysSinceCreated =
        (Date.now() - grievance.createdAt) / (1000 * 60 * 60 * 24);
      const threshold = 7;

      if (daysSinceCreated > threshold) {
        grievance.isOverdue = true;
        grievance.status = 'Overdue';
        await grievance.save();
        console.log(`Marked grievance ${grievance._id} as Overdue`);
      }
    }
    console.log('Overdue check complete!');
  } catch (err) {
    console.error('Overdue check error:', err.message);
  }
};

module.exports = checkOverdueComplaints;