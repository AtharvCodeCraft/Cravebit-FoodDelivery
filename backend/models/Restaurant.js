const mongoose = require('mongoose');

const restaurantSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a restaurant name'],
      unique: true,
      trim: true,
      maxlength: [50, 'Name can not be more than 50 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [500, 'Description can not be more than 500 characters'],
    },
    image: {
      type: String,
      default: 'no-photo.jpg',
    },
    address: {
      type: String,
      required: [true, 'Please add an address'],
    },
    rating: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating must can not be more than 5'],
      default: 4.0,
    },
    deliveryTime: {
      type: String,
      default: '30-40 min',
    },
    estimatedCost: {
      type: Number,
      default: 200,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Restaurant', restaurantSchema);
