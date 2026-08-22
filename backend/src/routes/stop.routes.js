const express = require('express');
const router = express.Router();
const { addStop, updateStop, deleteStop } = require('../controllers/stop.controller');
const authenticateToken = require('../middleware/auth.middleware');

router.use(authenticateToken);

router.post('/', addStop);
router.put('/:id', updateStop);
router.delete('/:id', deleteStop);

module.exports = router;
