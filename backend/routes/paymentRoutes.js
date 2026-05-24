const express = require('express');
const router = express.Router();
const { createRazorpayOrder } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/razorpay-order', protect, createRazorpayOrder);

// Also endpoint to get Razorpay key for frontend
router.get('/config', protect, (req, res) => {
  res.json({ keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_YourKeyIdHere' });
});

module.exports = router;
