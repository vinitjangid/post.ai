require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const SchedulerService = require('./services/schedulerService');
const LinkedInService = require('./services/linkedinService');
const LinkedInMCQService = require('./services/linkedinMCQService');
const config = require('./config/config');
const connectDB = require('./config/database');
const { logger } = require('./utils/logger');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB().catch(err => logger.error('Failed to connect to MongoDB:', err));

// Session configuration
const sessionConfig = {
  secret: process.env.SESSION_SECRET || 'linkedin-js-tips-poster-secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV === 'production' }
};

// Middleware
app.use(cors());
app.use(express.json());
app.use(session(sessionConfig));
app.use(express.static(path.join(__dirname, '../frontend/build')));
app.use('/uploads', express.static(path.join(__dirname, './uploads')));

// Import routes
const apiRoutes = require('./routes/api');
const authRoutes = require('./routes/auth');

// Use routes
app.use('/api', apiRoutes);
app.use('/auth', authRoutes);

// API status endpoint
app.get('/', (req, res) => {
  res.json({ status: 'API is running successfully' });
});

// Health check endpoint for deployment platforms
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

// Start the server
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

// Start message
logger.info('Starting LinkedIn JS Tips Poster...');

// Connect to database and start application
const startApp = async () => {
  try {
    // Connect to MongoDB if in production
    if (process.env.NODE_ENV === 'production') {
      await connectDB();
    } else {
      logger.info('Running in development mode, skipping database connection');
    }

    // Initialize services
    try {
      const linkedinService = new LinkedInService(config.linkedin);
      const linkedinMCQService = new LinkedInMCQService(config.linkedin);
      const schedulerService = new SchedulerService(linkedinService, config.linkedin);
      
      // Make these available globally for the API routes
      global.linkedinService = linkedinService;
      global.linkedinMCQService = linkedinMCQService;
      global.schedulerService = schedulerService;
      
      // Only start scheduler in production
      if (process.env.NODE_ENV === 'production') {
        // Start the scheduler
        schedulerService.scheduleDailyPosts();
      }
      
      // Log successful startup
      logger.info('LinkedIn JS Tips Poster is now running');
      logger.info(`Server running at: ${config.app.baseUrl}`);
      logger.info(`Environment: ${config.app.nodeEnv}`);
      logger.info(`Next tip post will be at 9:00 AM`);
      logger.info(`Next MCQ post will be at 3:00 PM on Monday, Wednesday, Friday`);
    } catch (error) {
      logger.error('Failed to initialize services:', error);
      throw error;
    }
  } catch (error) {
    logger.error('Failed to start application:', error);
    process.exit(1);
  }
};

// Start the application
startApp();