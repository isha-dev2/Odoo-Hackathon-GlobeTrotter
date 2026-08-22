const express = require('express');
const router = express.Router();
const {
  createTrip,
  getTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  getPublicTripBySlug,
  copyPublicTrip,
} = require('../controllers/trip.controller');
const authenticateToken = require('../middleware/auth.middleware');

// Public shared trip route (no auth required)
router.get('/share/:shareSlug', getPublicTripBySlug);

// Protected trip routes
router.use(authenticateToken);

router.post('/', createTrip);
router.get('/', getTrips);
router.get('/:id', getTripById);
router.put('/:id', updateTrip);
router.delete('/:id', deleteTrip);
router.post('/share/:shareSlug/copy', copyPublicTrip);

module.exports = router;
