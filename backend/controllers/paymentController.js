const Razorpay = require('razorpay');
const crypto = require('crypto');

// @desc    Create Razorpay order
// @route   POST /api/payment/razorpay-order
// @access  Private
const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_YourKeyIdHere',
      key_secret: process.env.RAZORPAY_KEY_SECRET || 'YourKeySecretHere',
    });

    const options = {
      amount: Math.round(amount * 100), // amount in smallest currency unit (paise)
      currency: 'INR',
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await instance.orders.create(options);

    if (!order) return res.status(500).json({ message: 'Some error occurred with Razorpay' });

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createRazorpayOrder,
};
