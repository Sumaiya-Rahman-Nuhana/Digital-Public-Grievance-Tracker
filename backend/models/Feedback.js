const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  grievance: { type: mongoose.Schema.Types.ObjectId, ref: 'Grievance', required: true },
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, trim: true },
}, { timestamps: true });

feedbackSchema.index({ grievance: 1, submittedBy: 1 }, { unique: true });

module.exports = mongoose.model('Feedback', feedbackSchema);