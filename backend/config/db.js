const mongoose = require('mongoose');

const connectDB = async () => {
  mongoose.connection.on('connected', () => {
    console.log(`\x1b[32m%s\x1b[0m`, `✅ MongoDB Connection Established`);
  });

  mongoose.connection.on('error', (err) => {
    console.error(`\x1b[31m%s\x1b[0m`, `❌ MongoDB Runtime Error: ${err.message}`);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn(`\x1b[33m%s\x1b[0m`, `⚠️ MongoDB Disconnected`);
  });

  try {
    const uri = process.env.MONGO_URI;
    console.log(`\x1b[36m%s\x1b[0m`, `⏳ Attempting to connect to MongoDB...`);
    
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 30000,
    });
  } catch (error) {
    console.error(`\x1b[31m%s\x1b[0m`, `❌ MongoDB Initial Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
