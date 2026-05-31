import mongoose from 'mongoose';

const apartmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide apartment name'],
    unique: true,
    trim: true,
  },
  address: {
    type: String,
    required: [true, 'Please provide address'],
  },
  city: String,
  state: String,
  zipCode: String,
  description: String,
  amenities: [String],
  totalResidents: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

export default mongoose.model('Apartment', apartmentSchema);
