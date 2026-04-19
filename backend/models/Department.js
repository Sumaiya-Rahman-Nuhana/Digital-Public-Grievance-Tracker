const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  categories: [String],
  totalComplaints: { type: Number, default: 0 },
  resolvedComplaints: { type: Number, default: 0 },
  avgResolutionTime: { type: Number, default: 0 }
}, { timestamps: true });

departmentSchema.virtual('resolutionRate').get(function () {
  if (this.totalComplaints === 0) return 0;
  return ((this.resolvedComplaints / this.totalComplaints) * 100).toFixed(1);
});

departmentSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Department', departmentSchema);