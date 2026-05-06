const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
    },
    foodItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FoodItem',
    },
    rating: {
      type: Number,
      required: [true, 'Please add a rating between 1 and 5'],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, 'Please add a comment'],
    },
  },
  {
    timestamps: true,
  }
);

// Prevent user from submitting more than one review per restaurant or food item
reviewSchema.index({ restaurantId: 1, userId: 1 }, { unique: true, sparse: true });
reviewSchema.index({ foodItemId: 1, userId: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('Review', reviewSchema);
