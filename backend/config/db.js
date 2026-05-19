// Database connection configuration
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI environment variable is not set!');
      return;
    }
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    // Don't exit — let the server run so Render doesn't restart loop
  }
};

module.exports = connectDB;
