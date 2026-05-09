const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const check = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const count = await User.countDocuments();
    console.log(`Total Users in DB: ${count}`);
    if (count > 0) {
      const users = await User.find().limit(2);
      console.log('Sample Users:', users.map(u => u.email));
    }
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

check();
