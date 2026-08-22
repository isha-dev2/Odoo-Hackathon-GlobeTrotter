const express = require('express');
const router = express.Router();
const { getCities, getCityById, createCity } = require('../controllers/city.controller');
const authenticateToken = require('../middleware/auth.middleware');

// Public route to search & view cities
router.get('/', getCities);
router.get('/:id', getCityById);

// Protected admin endpoint to create cities
router.post('/', authenticateToken, createCity);

module.exports = router;
