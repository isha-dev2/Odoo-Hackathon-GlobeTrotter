require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const tripRoutes = require('./routes/trip.routes');
const stopRoutes = require('./routes/stop.routes');
const cityRoutes = require('./routes/city.routes');
const activityRoutes = require('./routes/activity.routes');
const budgetRoutes = require('./routes/budget.routes');
const adminRoutes = require('./routes/admin.routes');
const agentRoutes = require('./routes/agent.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes (All 13 Features Supported + AI Agent)
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/stops', stopRoutes);
app.use('/api/cities', cityRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/agent', agentRoutes);

// Health check and root endpoints
app.get('/', (req, res) => {
  res.json({
    message: '🚀 GlobeTrotter Backend API is running',
    version: '1.0.0',
    status: 'OK',
    endpoints: [
      '/api/auth',
      '/api/dashboard',
      '/api/trips',
      '/api/stops',
      '/api/cities',
      '/api/activities',
      '/api/budget',
      '/api/admin',
    ],
  });
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
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 GlobeTrotter Backend Server running on http://localhost:${PORT}`);
});
