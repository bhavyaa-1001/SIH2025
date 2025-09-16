const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');

// Load environment variables
dotenv.config();

// Import routes
const assessmentRoutes = require('./routes/assessment.routes');
const complianceRoutes = require('./routes/complianceRoutes');
const explanationRoutes = require('./routes/explanation.routes');
const userRoutes = require('./routes/user.routes');
const waterSavingsRoutes = require('./routes/waterSavings.routes');
const mlRoutes = require('./routes/ml.routes');
const runoffRoutes = require('./routes/runoff.routes');
const runoffReportRoutes = require('./routes/runoff_report.routes');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL : 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/rainwater-harvesting');
    console.log('MongoDB connected');
    return true;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    console.log('Starting server without MongoDB connection. Some features may not work.');
    return false;
  }
};

// Routes
app.use('/api/assessments', assessmentRoutes);
app.use('/api/compliance', complianceRoutes);
app.use('/api/explanation', explanationRoutes);
app.use('/api/runoff-report', runoffReportRoutes);
app.use('/api/users', userRoutes);
app.use('/api/runoff', runoffRoutes);
app.use('/api/water-savings', waterSavingsRoutes);
app.use('/api/ml', mlRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Rainwater Harvesting Assessment API is running');
});

// Start server
connectDB().then((connected) => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    if (!connected) {
      console.log('Warning: Running without MongoDB connection. Some features will not work.');
    }
  });
});