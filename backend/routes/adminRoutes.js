const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllUsers,
  deleteUser,
  getAllRestaurants,
  getAllFoodItems,
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.use(protect);
router.use(admin);

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.get('/restaurants', getAllRestaurants);
router.get('/fooditems', getAllFoodItems);

module.exports = router;
