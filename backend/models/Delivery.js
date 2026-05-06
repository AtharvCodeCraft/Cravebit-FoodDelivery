const mongoose = require('mongoose');

const deliverySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    phone: {
      type: String,
      required: [true, 'Please add a phone number'],
      unique: true,
    },
    vehicleType: {
      type: String,
      enum: ['Bike', 'Scooter', 'Car'],
      default: 'Bike',
    },
    vehicleNumber: {
      type: String,
      required: [true, 'Please add vehicle number'],
    },
    currentLocation: {
      lat: Number,
      lng: Number,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    currentOrderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Delivery', deliverySchema);
