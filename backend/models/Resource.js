import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide resource name'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide resource description'],
  },
  category: {
    type: String,
    enum: ['tools', 'books', 'equipment', 'parking', 'other'],
    required: [true, 'Please provide resource category'],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  apartmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Apartment',
    required: true,
  },
  availability: {
    type: Boolean,
    default: true,
  },
  quantity: {
    type: Number,
    default: 1,
  },
  image: String,
  condition: {
    type: String,
    enum: ['excellent', 'good', 'fair'],
    default: 'good',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

export default mongoose.model('Resource', resourceSchema);
