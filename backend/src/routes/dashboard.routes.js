const express = require('express');
const router = express.Router();
const { getDashboardData } = require('../controllers/dashboard.controller');
const authenticateToken = require('../middleware/auth.middleware');

router.use(authenticateToken);

router.get('/', getDashboardData);

module.exports = router;
