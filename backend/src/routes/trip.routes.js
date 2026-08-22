const express = require('express');
const router = express.Router();
const {
  createTrip,
  getTrips,
  getTripById,
  deleteTrip,
} = require('../controllers/trip.controller');
const authenticateToken = require('../middleware/auth.middleware');

// Protect all trip routes
router.use(authenticateToken);

router.post('/', createTrip);
router.get('/', getTrips);
router.get('/:id', getTripById);
router.delete('/:id', deleteTrip);

module.exports = router;
