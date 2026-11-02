const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://Aryan_Tiwari:Aryan123@cluster0.k4ggxjo.mongodb.net/feedbackDB2';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
