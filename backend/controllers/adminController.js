const User = require('../models/User');
const Order = require('../models/Order');
const Restaurant = require('../models/Restaurant');
const FoodItem = require('../models/FoodItem');

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalRestaurants = await Restaurant.countDocuments();
    const totalOrders = await Order.countDocuments();
    
    const orders = await Order.find();
    const totalRevenue = orders.reduce((acc, item) => acc + item.totalAmount, 0);

    // Get revenue and order count for last 7 days
    const today = new Date();
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      date.setHours(0, 0, 0, 0);
      last7Days.push(date);
    }

    const dailyStats = await Promise.all(last7Days.map(async (date) => {
      const nextDate = new Date(date);
      nextDate.setDate(date.getDate() + 1);

      const dailyOrders = await Order.find({
        createdAt: { $gte: date, $lt: nextDate }
      });

      const revenue = dailyOrders.reduce((acc, order) => acc + order.totalAmount, 0);
      
      return {
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        orders: dailyOrders.length,
        revenue: revenue
      };
    }));

    const recentActivity = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('userId', 'name email');

    res.json({
      stats: {
        totalUsers,
        totalRestaurants,
        totalOrders,
        totalRevenue
      },
      dailyStats,
      recentActivity
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      if (user.role === 'admin') {
        return res.status(400).json({ message: 'Cannot delete admin user' });
      }
      await user.deleteOne();
      res.json({ message: 'User removed' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all restaurants
// @route   GET /api/admin/restaurants
// @access  Private/Admin
exports.getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({}).populate('owner', 'name email');
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all food items
// @route   GET /api/admin/fooditems
// @access  Private/Admin
exports.getAllFoodItems = async (req, res) => {
  try {
    const foodItems = await FoodItem.find({}).populate('restaurantId', 'name');
    res.json(foodItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
