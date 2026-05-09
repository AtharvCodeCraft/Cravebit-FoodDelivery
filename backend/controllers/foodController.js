const FoodItem = require('../models/FoodItem');

// @desc    Get all food items
// @route   GET /api/food
// @access  Public
const getFoodItems = async (req, res) => {
  try {
    const foodItems = await FoodItem.find({ isAvailable: true }).populate(
      'restaurantId',
      'name'
    );
    res.json(foodItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get food items by restaurant
// @route   GET /api/food/restaurant/:id
// @access  Public
const getFoodItemsByRestaurant = async (req, res) => {
  try {
    const foodItems = await FoodItem.find({
      restaurantId: req.params.id,
      isAvailable: true,
    }).populate('restaurantId', 'name');
    res.json(foodItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const Review = require('../models/Review');

// @desc    Get single food item
// @route   GET /api/food/:id
// @access  Public
const getFoodItemById = async (req, res) => {
  try {
    const foodItem = await FoodItem.findById(req.params.id).populate(
      'restaurantId',
      'name address image rating deliveryTime'
    );

    if (!foodItem) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    // Get reviews for this food item
    const reviews = await Review.find({ foodItemId: req.params.id })
      .populate('userId', 'name image')
      .sort({ createdAt: -1 });

    // Get related food items (same category, different item)
    const relatedItems = await FoodItem.find({
      category: foodItem.category,
      _id: { $ne: foodItem._id },
      isAvailable: true
    }).limit(4);

    res.json({
      ...foodItem._doc,
      reviews,
      relatedItems
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new food item
// @route   POST /api/food
// @access  Private/Admin
const createFoodItem = async (req, res) => {
  try {
    const {
      restaurantId,
      name,
      description,
      price,
      category,
      isVegetarian,
    } = req.body;

    const foodItem = new FoodItem({
      restaurantId,
      name,
      description,
      price,
      category,
      isVegetarian,
    });

    const createdFoodItem = await foodItem.save();
    res.status(201).json(createdFoodItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a food item
// @route   PUT /api/food/:id
// @access  Private/Admin
const updateFoodItem = async (req, res) => {
  try {
    const foodItem = await FoodItem.findById(req.params.id);

    if (foodItem) {
      foodItem.name = req.body.name || foodItem.name;
      foodItem.description = req.body.description || foodItem.description;
      foodItem.price = req.body.price || foodItem.price;
      foodItem.category = req.body.category || foodItem.category;
      
      if (req.body.isVegetarian !== undefined) {
        foodItem.isVegetarian = req.body.isVegetarian;
      }
      if (req.body.isAvailable !== undefined) {
        foodItem.isAvailable = req.body.isAvailable;
      }

      const updatedFoodItem = await foodItem.save();
      res.json(updatedFoodItem);
    } else {
      res.status(404).json({ message: 'Food item not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a food item
// @route   DELETE /api/food/:id
// @access  Private/Admin
const deleteFoodItem = async (req, res) => {
  try {
    const foodItem = await FoodItem.findById(req.params.id);

    if (foodItem) {
      await foodItem.deleteOne();
      res.json({ message: 'Food item removed' });
    } else {
      res.status(404).json({ message: 'Food item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getFoodItems,
  getFoodItemsByRestaurant,
  getFoodItemById,
  createFoodItem,
  updateFoodItem,
  deleteFoodItem,
};
