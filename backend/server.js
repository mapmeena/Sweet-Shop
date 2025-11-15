require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const sweetsRoutes = require('./routes/sweetsRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ MongoDB connected successfully');
  console.log(`📦 Database: ${mongoose.connection.name}`);
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/sweets', sweetsRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Sweet Shop API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      sweets: '/api/sweets'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`🌐 API URL: http://localhost:${PORT}`);
});
