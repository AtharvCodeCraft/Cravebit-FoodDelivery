const express = require('express');
const router = express.Router();
const { addReview, getRestaurantReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, addReview);
router.route('/restaurant/:id').get(getRestaurantReviews);

module.exports = router;
