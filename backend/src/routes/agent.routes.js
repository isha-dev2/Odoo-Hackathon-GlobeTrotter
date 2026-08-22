const express = require('express');
const router = express.Router();
const { generateAiPlan } = require('../controllers/agent.controller');

router.post('/plan', generateAiPlan);

module.exports = router;
