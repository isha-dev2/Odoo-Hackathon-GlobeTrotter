const express = require('express');
const router = express.Router();
const { getTripBudget } = require('../controllers/budget.controller');
const authenticateToken = require('../middleware/auth.middleware');

router.use(authenticateToken);

router.get('/trip/:tripId', getTripBudget);

module.exports = router;
