const mongoose = require('mongoose');

const foodItemSchema = mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Please add a food name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
    },
    image: {
      type: String,
      default: 'no-food-photo.jpg',
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
      enum: ['Starter', 'Main Course', 'Dessert', 'Beverage', 'Snack', 'Other'],
    },
    isVegetarian: {
      type: Boolean,
      default: false,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('FoodItem', foodItemSchema);
