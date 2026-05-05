const mongoose = require('mongoose');

const grievanceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: {
<<<<<<< HEAD
      type: String, required: true,
=======
      type: String,
      required: true,
>>>>>>> origin/main
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
<<<<<<< HEAD
      coordinates: { lat: { type: Number }, lng: { type: Number } },
    },
    media: [{ url: String, publicId: String, type: { type: String, enum: ['image', 'video'] } }],
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updates: [{
      message: String,
      updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      date: { type: Date, default: Date.now },
    }],
=======
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
>>>>>>> origin/main
    trackingId: { type: String, unique: true },
    upvotes: { type: Number, default: 0 },
    upvotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

grievanceSchema.pre('save', async function () {
  if (!this.trackingId) {
    this.trackingId = 'GRV-' + Date.now().toString(36).toUpperCase();
  }
});

module.exports = mongoose.model('Grievance', grievanceSchema);