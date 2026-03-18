const mongoose = require('mongoose');

const grievanceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ['road', 'drainage', 'water', 'electricity', 'healthcare', 'education', 'other'],
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'resolved', 'rejected'],
      default: 'pending',
    },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    location: {
      address: { type: String },
      coordinates: {
        lat: { type: Number },
        lng: { type: Number },
      },
    },
    media: [
      {
        url: { type: String },
        publicId: { type: String },
        type: { type: String, enum: ['image', 'video'] },
      },
    ],
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updates: [
      {
        message: String,
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        date: { type: Date, default: Date.now },
      },
    ],
    trackingId: { type: String, unique: true },
    upvotes: { type: Number, default: 0 },
    upvotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

// Auto-generate tracking ID before save
grievanceSchema.pre('save', function (next) {
  if (!this.trackingId) {
    this.trackingId = 'GRV-' + Date.now().toString(36).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Grievance', grievanceSchema);