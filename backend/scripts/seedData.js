/**
 * seedData.js
 * -----------
 * Reads CSV files from backend/data/ and seeds the MongoDB database.
 * Run with:  npm run seed
 */

const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
// process.cwd() = backend/ when called via "npm run seed"
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });

// Models
const Restaurant = require('../models/Restaurant');
const FoodItem = require('../models/FoodItem');
const User = require('../models/User');
const Review = require('../models/Review');

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Parse a CSV file and return array of row objects */
function readCSV(filename) {
  return new Promise((resolve, reject) => {
    const results = [];
    const filePath = path.join(__dirname, '../data', filename);

    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️  File not found, skipping: ${filename}`);
      return resolve([]);
    }

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => results.push(row))
      .on('end', () => resolve(results))
      .on('error', reject);
  });
}

/**
 * Map CSV category values → FoodItem schema enum values
 * Allowed: 'Starter' | 'Main Course' | 'Dessert' | 'Beverage' | 'Snack' | 'Other'
 */
function mapCategory(raw = '') {
  const map = {
    breakfast:    'Snack',
    dessert:      'Dessert',
    beverage:     'Beverage',
    'main course': 'Main Course',
    snack:         'Snack',
    snacks:        'Snack',
    starter:       'Starter',
    'south indian': 'Main Course',
    'street food':  'Snack',
    'fast food':    'Snack',
    bread:          'Other',
    other:          'Other',
  };
  return map[raw.trim().toLowerCase()] || 'Other';
}

// ─── Seed Functions ───────────────────────────────────────────────────────────

async function seedRestaurants() {
  const rows = await readCSV('restaurants.csv');
  if (!rows.length) return {};

  await Restaurant.deleteMany({});
  console.log('🗑️  Cleared restaurants collection');

  // restaurant_id (CSV integer) → MongoDB ObjectId
  const idMap = {};

  for (const row of rows) {
    const doc = await Restaurant.create({
      name: row.name.trim(),
      description: `${row.type ? row.type.trim() : 'Restaurant'} in ${row.city ? row.city.trim() : ''}, ${row.area ? row.area.trim() : ''}`,
      address: `${row.area ? row.area.trim() : ''}, ${row.city ? row.city.trim() : ''}`,
      rating: parseFloat(row.rating) || 4.0,
      isActive: true,
    });
    idMap[row.restaurant_id] = doc._id;
  }

  console.log(`✅ Seeded ${rows.length} restaurants`);
  return idMap;
}

async function seedFoodItems(restaurantIdMap) {
  const rows = await readCSV('food_items.csv');
  if (!rows.length) return {};

  await FoodItem.deleteMany({});
  console.log('🗑️  Cleared fooditems collection');

  const idMap = {};

  for (const row of rows) {
    const restaurantId = restaurantIdMap[row.restaurant_id.trim()];
    if (!restaurantId) {
      console.warn(`⚠️  Unknown restaurant_id "${row.restaurant_id}" for item "${row.name}" — skipping`);
      continue;
    }

    const doc = await FoodItem.create({
      restaurantId,
      name: row.name.trim(),
      description: `${row.name.trim()} — a delicious ${row.category ? row.category.trim() : 'item'}`,
      price: parseFloat(row.price) || 0,
      category: mapCategory(row.category),
      isVegetarian: row.veg ? row.veg.trim().toLowerCase() === 'true' : true,
      isAvailable: true,
    });
    idMap[row.item_id] = doc._id;
  }

  console.log(`✅ Seeded ${rows.length} food items`);
  return idMap;
}

/**
 * Create seed users for reviews (user_ids 1–5 from reviews.csv).
 * Returns a map: csv_user_id → MongoDB ObjectId
 */
async function seedSeedUsers() {
  const seedUsers = [
    { csvId: '1', name: 'Rahul Sharma',  email: 'rahul@example.com',  phone: '9111111111' },
    { csvId: '2', name: 'Priya Verma',   email: 'priya@example.com',  phone: '9222222222' },
    { csvId: '3', name: 'Amit Patel',    email: 'amit@example.com',   phone: '9333333333' },
    { csvId: '4', name: 'Sneha Gupta',   email: 'sneha@example.com',  phone: '9444444444' },
    { csvId: '5', name: 'Vikram Singh',  email: 'vikram@example.com', phone: '9555555555' },
  ];

  const idMap = {};
  const defaultPassword = 'password123';

  for (const u of seedUsers) {
    // upsert: don't wipe real user accounts
    let user = await User.findOne({ email: u.email }).select('+password');
    if (!user) {
      user = await User.create({
        name: u.name,
        email: u.email,
        password: defaultPassword, // Model's pre-save hook will hash this
        phone: u.phone,
        role: 'user',
      });
    }
    idMap[u.csvId] = user._id;
  }

  console.log(`✅ Ensured ${seedUsers.length} seed users`);
  return idMap;
}

async function seedReviews(userIdMap, restaurantIdMap) {
  const rows = await readCSV('reviews.csv');
  if (!rows.length) return;

  await Review.deleteMany({});
  console.log('🗑️  Cleared reviews collection');

  let count = 0;
  for (const row of rows) {
    const userId = userIdMap[row.user_id ? row.user_id.trim() : ''];
    const restaurantId = restaurantIdMap[row.restaurant_id ? row.restaurant_id.trim() : ''];

    if (!userId || !restaurantId) {
      console.warn(`⚠️  Skipping review_id "${row.review_id}": unresolved user or restaurant`);
      continue;
    }

    await Review.create({
      userId,
      restaurantId,
      rating: parseInt(row.rating) || 4,
      comment: row.comment ? row.comment.trim() : 'Great!',
    });
    count++;
  }

  console.log(`✅ Seeded ${count} reviews`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🌱 Starting database seed...\n');

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // Order matters — FoodItems depend on Restaurants; Reviews depend on both
    const restaurantIdMap = await seedRestaurants();
    const _foodItemIdMap  = await seedFoodItems(restaurantIdMap);
    const userIdMap       = await seedSeedUsers();
    await seedReviews(userIdMap, restaurantIdMap);

    console.log('\n🎉 Database seeded successfully!\n');
  } catch (err) {
    console.error('\n❌ Seed failed:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

main();
