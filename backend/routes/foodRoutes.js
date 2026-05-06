const express = require('express');
const router = express.Router();
const {
  getFoodItems,
  getFoodItemsByRestaurant,
  getFoodItemById,
  createFoodItem,
  updateFoodItem,
  deleteFoodItem,
} = require('../controllers/foodController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getFoodItems).post(protect, admin, createFoodItem);
router.route('/restaurant/:id').get(getFoodItemsByRestaurant);
router
  .route('/:id')
  .get(getFoodItemById)
  .put(protect, admin, updateFoodItem)
  .delete(protect, admin, deleteFoodItem);

module.exports = router;
