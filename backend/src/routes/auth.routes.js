const express = require('express');
const router = express.Router();
const { signup, login, me, updateProfile } = require('../controllers/auth.controller');
const authenticateToken = require('../middleware/auth.middleware');

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', authenticateToken, me);
router.put('/profile', authenticateToken, updateProfile);

module.exports = router;
