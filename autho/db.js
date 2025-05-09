const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected via Mongoose!");
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error);
  }
};

module.exports = connectDB;

