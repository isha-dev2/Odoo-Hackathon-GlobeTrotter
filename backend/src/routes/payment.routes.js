const express = require('express');
const router = express.Router();
const {
  createPaymentOrder,
  verifyPayment,
  getTravelerBookings,
  getInvoiceDetails,
} = require('../controllers/payment.controller');

// Payment Gateway & Booking Endpoints
router.post('/create-order', createPaymentOrder);
router.post('/verify-payment', verifyPayment);
router.get('/bookings', getTravelerBookings);
router.get('/invoice/:bookingRef', getInvoiceDetails);

module.exports = router;
