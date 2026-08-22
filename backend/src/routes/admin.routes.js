const express = require('express');
const router = express.Router();
const { getAnalytics } = require('../controllers/admin.controller');
const authenticateToken = require('../middleware/auth.middleware');

router.use(authenticateToken);

router.get('/analytics', getAnalytics);

module.exports = router;
