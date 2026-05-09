const Order = require('../models/Order');
const FoodItem = require('../models/FoodItem');
const Restaurant = require('../models/Restaurant');

// @desc    Get orders for a specific restaurant
// @route   GET /api/restaurant/:id/orders
// @access  Private/Admin
const getRestaurantOrders = async (req, res) => {
  try {
    const orders = await Order.find({ restaurantId: req.params.id })
      .populate('userId', 'name email phone')
      .sort('-createdAt');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Accept or reject an order
// @route   PUT /api/restaurant/orders/:id/status
// @access  Private/Admin
const updateRestaurantOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const { status } = req.body;
    const validTransitions = {
      Placed: ['Preparing', 'Cancelled'],
      Preparing: ['Out for Delivery', 'Cancelled'],
      'Out for Delivery': ['Delivered'],
    };

    if (validTransitions[order.orderStatus] && !validTransitions[order.orderStatus].includes(status)) {
      return res.status(400).json({ message: `Cannot transition from ${order.orderStatus} to ${status}` });
    }

    order.orderStatus = status;
    const updated = await order.save();

    // Real-time notification
    const io = req.app.get('io');
    io.to(`order_${order._id}`).emit('order_status_update', {
      orderId: order._id,
      status: order.orderStatus,
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get restaurant analytics
// @route   GET /api/restaurant/:id/analytics
// @access  Private/Admin
const getRestaurantAnalytics = async (req, res) => {
  try {
    const restaurantId = req.params.id;

    const orders = await Order.find({ restaurantId });

    const totalOrders = orders.length;
    const totalRevenue = orders
      .filter(o => o.orderStatus === 'Delivered')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const pendingOrders = orders.filter(o => o.orderStatus === 'Placed').length;
    const preparingOrders = orders.filter(o => o.orderStatus === 'Preparing').length;
    const deliveredOrders = orders.filter(o => o.orderStatus === 'Delivered').length;
    const cancelledOrders = orders.filter(o => o.orderStatus === 'Cancelled').length;

    // Daily revenue for the last 7 days
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

      const dayRevenue = orders
        .filter(o => {
          const oDate = new Date(o.createdAt);
          return (
            oDate.getDate() === date.getDate() &&
            oDate.getMonth() === date.getMonth() &&
            oDate.getFullYear() === date.getFullYear() &&
            o.orderStatus === 'Delivered'
          );
        })
        .reduce((sum, o) => sum + o.totalAmount, 0);

      last7Days.push({ date: dateStr, revenue: dayRevenue });
    }

    // Top selling items
    const itemMap = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        if (!itemMap[item.name]) itemMap[item.name] = { name: item.name, count: 0, revenue: 0 };
        itemMap[item.name].count += item.quantity;
        itemMap[item.name].revenue += item.price * item.quantity;
      });
    });
    const topItems = Object.values(itemMap).sort((a, b) => b.count - a.count).slice(0, 5);

    res.json({
      totalOrders,
      totalRevenue,
      pendingOrders,
      preparingOrders,
      deliveredOrders,
      cancelledOrders,
      last7Days,
      topItems,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all food items for a restaurant (including unavailable)
// @route   GET /api/restaurant/:id/menu
// @access  Private/Admin
const getRestaurantMenu = async (req, res) => {
  try {
    const items = await FoodItem.find({ restaurantId: req.params.id }).sort('-createdAt');
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create food item with image
// @route   POST /api/restaurant/:id/menu
// @access  Private/Admin
const createMenuItem = async (req, res) => {
  try {
    const { name, description, price, category, isVegetarian } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : undefined;

    const item = await FoodItem.create({
      restaurantId: req.params.id,
      name,
      description,
      price: Number(price),
      category,
      isVegetarian: isVegetarian === 'true' || isVegetarian === true,
      ...(image && { image }),
    });
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update food item
// @route   PUT /api/restaurant/menu/:itemId
// @access  Private/Admin
const updateMenuItem = async (req, res) => {
  try {
    const item = await FoodItem.findById(req.params.itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    const { name, description, price, category, isVegetarian, isAvailable } = req.body;
    item.name = name ?? item.name;
    item.description = description ?? item.description;
    item.price = price !== undefined ? Number(price) : item.price;
    item.category = category ?? item.category;
    item.isVegetarian = isVegetarian !== undefined ? (isVegetarian === 'true' || isVegetarian === true) : item.isVegetarian;
    item.isAvailable = isAvailable !== undefined ? (isAvailable === 'true' || isAvailable === true) : item.isAvailable;

    if (req.file) item.image = `/uploads/${req.file.filename}`;

    const updated = await item.save();
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete food item
// @route   DELETE /api/restaurant/menu/:itemId
// @access  Private/Admin
const deleteMenuItem = async (req, res) => {
  try {
    const item = await FoodItem.findById(req.params.itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    await item.deleteOne();
    res.json({ message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update restaurant profile
// @route   PUT /api/restaurant/:id/profile
// @access  Private/Admin
const updateRestaurantProfile = async (req, res) => {
  try {
    const { name, description, address, deliveryTime, estimatedCost, isActive } = req.body;
    const update = { name, description, address, deliveryTime, estimatedCost, isActive };
    if (req.file) update.image = `/uploads/${req.file.filename}`;

    const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
    res.json(restaurant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getRestaurantOrders,
  updateRestaurantOrderStatus,
  getRestaurantAnalytics,
  getRestaurantMenu,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  updateRestaurantProfile,
};
