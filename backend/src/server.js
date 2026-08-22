require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const tripRoutes = require('./routes/trip.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);

// Health check and root endpoints
app.get('/', (req, res) => {
  res.json({ message: 'GlobeTrotter API is running', status: 'OK' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'UP', timestamp: new Date() });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 GlobeTrotter Backend Server running on http://localhost:${PORT}`);
});
