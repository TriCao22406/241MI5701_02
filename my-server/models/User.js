const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Tạo một đối tượng User 
const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: [/^\d{10,15}$/, 'Please enter a valid phone number'],
  },
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  birthDate: {
    day: {
      type: Number,
      required: true,
      min: 1,
      max: 31,
    },
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    year: {
      type: Number,
      required: true,
      min: 1900,
      max: new Date().getFullYear(),
    },
  },
  password: {
    type: String,
    required: true,
  },
  agreedToTerms: {
    type: Boolean,
    required: true,
  },
}, {
  timestamps: true,
}, { collection: 'users' });

module.exports = mongoose.model('User', UserSchema);
