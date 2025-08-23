/**
 * MongoDB Database Connection
 * 
 * This file handles the connection to MongoDB Atlas or other MongoDB providers.
 */

const mongoose = require('mongoose');
const { logger } = require('../utils/logger');

// Connection URI from environment variables
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/linkedin-js-tips';

/**
 * Connect to MongoDB
 */
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    logger.info('MongoDB connected successfully');
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

/**
 * Handle MongoDB connection events
 */
mongoose.connection.on('connected', () => {
  logger.info('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  logger.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  logger.info('Mongoose disconnected from MongoDB');
});

// If Node process ends, close the MongoDB connection
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  logger.info('Mongoose connection closed through app termination');
  process.exit(0);
});

module.exports = connectDB;
