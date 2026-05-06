const Order = require('../models/Order');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
  try {
    const {
      restaurantId,
      items,
      deliveryAddress,
      paymentMethod,
      totalAmount,
    } = req.body;

    if (items && items.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    } else {
      const order = new Order({
        userId: req.user._id,
        restaurantId,
        items,
        deliveryAddress,
        paymentMethod,
        totalAmount,
        paymentStatus: 'Pending',
        orderStatus: 'Placed',
      });

      const createdOrder = await order.save();
      
      // Notify restaurant/admin about new order via socket
      const io = req.app.get('io');
      io.emit('new_order', createdOrder);

      res.status(201).json(createdOrder);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .populate('restaurantId', 'name image')
      .sort('-createdAt');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('userId', 'name email phone')
      .populate('restaurantId', 'name address');

    // Only allow admin or the order owner to view it
    if (order && (req.user.role === 'admin' || order.userId._id.equals(req.user._id))) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found or unauthorized' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.orderStatus = req.body.status || order.orderStatus;
      
      if (req.body.deliveryPartnerId) {
        order.deliveryPartnerId = req.body.deliveryPartnerId;
      }

      const updatedOrder = await order.save();

      // Emit status update to specific order room
      const io = req.app.get('io');
      io.to(`order_${order._id}`).emit('order_status_update', {
        orderId: order._id,
        status: order.orderStatus,
      });

      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('userId', 'id name')
      .populate('restaurantId', 'id name')
      .sort('-createdAt');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  getOrders,
};
