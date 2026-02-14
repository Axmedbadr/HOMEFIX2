const mongoose = require('mongoose');

const professionalSchema = new mongoose.Schema({
  full_name: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  skill: {
    type: String,
    required: [true, 'Skill is required'],
    enum: ['Painting', 'Electricity', 'Plumbing']
  },
  phone_number: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true,
    match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
  },
  rating: {
    type: Number,
    default: 5.0,
    min: [1.0, 'Rating must be at least 1.0'],
    max: [5.0, 'Rating cannot exceed 5.0']
  },
  status: {
    type: String,
    enum: ['Active', 'Suspended'],
    default: 'Active'
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Professional', professionalSchema);