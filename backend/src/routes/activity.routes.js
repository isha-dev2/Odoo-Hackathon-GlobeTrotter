const express = require('express');
const router = express.Router();
const {
  getActivityCatalog,
  addActivity,
  updateActivity,
  deleteActivity,
} = require('../controllers/activity.controller');
const authenticateToken = require('../middleware/auth.middleware');

// Public catalog search
router.get('/catalog', getActivityCatalog);

// Protected routes for managing activities on stops
router.post('/', authenticateToken, addActivity);
router.put('/:id', authenticateToken, updateActivity);
router.delete('/:id', authenticateToken, deleteActivity);

module.exports = router;
