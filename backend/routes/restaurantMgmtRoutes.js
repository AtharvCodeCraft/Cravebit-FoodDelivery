const express = require('express');
const router = express.Router();
const {
  getRestaurantOrders,
  updateRestaurantOrderStatus,
  getRestaurantAnalytics,
  getRestaurantMenu,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  updateRestaurantProfile,
} = require('../controllers/restaurantMgmtController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Analytics
router.get('/:id/analytics', protect, admin, getRestaurantAnalytics);

// Orders
router.get('/:id/orders', protect, admin, getRestaurantOrders);
router.put('/orders/:id/status', protect, admin, updateRestaurantOrderStatus);

// Menu
router.get('/:id/menu', protect, admin, getRestaurantMenu);
router.post('/:id/menu', protect, admin, upload.single('image'), createMenuItem);
router.put('/menu/:itemId', protect, admin, upload.single('image'), updateMenuItem);
router.delete('/menu/:itemId', protect, admin, deleteMenuItem);

// Profile
router.put('/:id/profile', protect, admin, upload.single('image'), updateRestaurantProfile);

module.exports = router;
