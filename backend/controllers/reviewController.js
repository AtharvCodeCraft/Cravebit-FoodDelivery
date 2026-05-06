const Review = require('../models/Review');
const Restaurant = require('../models/Restaurant');
const FoodItem = require('../models/FoodItem');

// @desc    Add a review
// @route   POST /api/reviews
// @access  Private
const addReview = async (req, res) => {
  try {
    const { restaurantId, foodItemId, rating, comment } = req.body;

    if (!restaurantId && !foodItemId) {
      return res.status(400).json({ message: 'Must provide restaurantId or foodItemId' });
    }

    const review = new Review({
      userId: req.user._id,
      restaurantId: restaurantId || undefined,
      foodItemId: foodItemId || undefined,
      rating,
      comment,
    });

    const createdReview = await review.save();
    
    // Update Avg Rating for Restaurant if applicable
    if (restaurantId) {
      const reviews = await Review.find({ restaurantId });
      const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
      await Restaurant.findByIdAndUpdate(restaurantId, { rating: avgRating });
    }

    res.status(201).json(createdReview);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already reviewed this item/restaurant' });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get reviews for a restaurant
// @route   GET /api/reviews/restaurant/:id
// @access  Public
const getRestaurantReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ restaurantId: req.params.id })
      .populate('userId', 'name')
      .sort('-createdAt');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addReview,
  getRestaurantReviews,
};
