const Restaurant = require('../models/Restaurant');

// @desc    Get all restaurants
// @route   GET /api/restaurants
// @access  Public
const getRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ isActive: true });
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single restaurant
// @route   GET /api/restaurants/:id
// @access  Public
const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (restaurant) {
      res.json(restaurant);
    } else {
      res.status(404).json({ message: 'Restaurant not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new restaurant
// @route   POST /api/restaurants
// @access  Private/Admin
const createRestaurant = async (req, res) => {
  try {
    const { name, description, address, deliveryTime, estimatedCost } = req.body;

    const restaurant = new Restaurant({
      name,
      description,
      address,
      deliveryTime,
      estimatedCost,
    });

    const createdRestaurant = await restaurant.save();
    res.status(201).json(createdRestaurant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a restaurant
// @route   PUT /api/restaurants/:id
// @access  Private/Admin
const updateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (restaurant) {
      restaurant.name = req.body.name || restaurant.name;
      restaurant.description = req.body.description || restaurant.description;
      restaurant.address = req.body.address || restaurant.address;
      restaurant.deliveryTime = req.body.deliveryTime || restaurant.deliveryTime;
      restaurant.estimatedCost = req.body.estimatedCost || restaurant.estimatedCost;
      
      if (req.body.isActive !== undefined) {
        restaurant.isActive = req.body.isActive;
      }

      const updatedRestaurant = await restaurant.save();
      res.json(updatedRestaurant);
    } else {
      res.status(404).json({ message: 'Restaurant not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a restaurant
// @route   DELETE /api/restaurants/:id
// @access  Private/Admin
const deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (restaurant) {
      await restaurant.deleteOne();
      res.json({ message: 'Restaurant removed' });
    } else {
      res.status(404).json({ message: 'Restaurant not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
};
