// models/vendor_model.js
const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  state: {
    type: String,
    default: '',
  },
  city: {
    type: String,
    default: '',
  },
  locality: {
    type: String,
    default: '',
  },
  role: {
    type: String,
    default: '',
  },
  password: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    default: '',
  },
  storeImage: {
    type: String,
    default: '',
  },
  storeDescription: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

const Vendor = mongoose.model('Vendor', vendorSchema);
module.exports = Vendor;
