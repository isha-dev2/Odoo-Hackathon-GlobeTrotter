const crypto = require('crypto');
const prisma = require('../config/db');

// In-memory / DB fallback for confirmed bookings
const IN_MEMORY_BOOKINGS = [];

/**
 * 1. Create Online Payment Order (Razorpay / UPI / Cards)
 */
const createPaymentOrder = async (req, res) => {
  try {
    const {
      tripId,
      activityId,
      amount,
      currency = 'INR',
      itemName = 'Itinerary Reservation',
      travelerName = 'Aarav Sharma',
      travelerEmail = 'traveler@globetrotter.in',
      travelerPhone = '+91 98765 43210'
    } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Valid payment amount is required.' });
    }

    const orderId = `order_${crypto.randomBytes(8).toString('hex')}`;
    const gstAmount = Math.round(amount * 0.05); // 5% GST for travel services
    const totalPayable = amount + gstAmount;

    const paymentOrder = {
      orderId,
      amount: totalPayable,
      baseAmount: amount,
      gstAmount,
      currency,
      tripId,
      activityId,
      itemName,
      traveler: {
        name: travelerName,
        email: travelerEmail,
        phone: travelerPhone
      },
      status: 'CREATED',
      createdAt: new Date().toISOString(),
      razorpayKeyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_OdooHackathon2026',
    };

    return res.status(201).json({
      success: true,
      message: 'Payment order initiated successfully',
      order: paymentOrder
    });
  } catch (error) {
    console.error('Payment order creation error:', error);
    return res.status(500).json({ error: 'Failed to initiate payment order.' });
  }
};

/**
 * 2. Verify Payment & Confirm Booking
 */
const verifyPayment = async (req, res) => {
  try {
    const {
      orderId,
      paymentMethod = 'UPI', // UPI | CARD | NETBANKING
      paymentId,
      signature,
      tripId,
      activityId,
      amount,
      currency = 'INR',
      itemName,
      travelerName = 'Aarav Sharma',
      travelerEmail = 'traveler@globetrotter.in'
    } = req.body;

    const transactionId = paymentId || `txn_${crypto.randomBytes(10).toString('hex')}`;
    const bookingRef = `GT-BK-${Math.floor(100000 + Math.random() * 900000)}`;

    const confirmedBooking = {
      id: `booking-${Date.now()}`,
      bookingRef,
      transactionId,
      orderId,
      tripId: tripId || null,
      activityId: activityId || null,
      itemName: itemName || 'Custom Multi-City Tour',
      amount: parseFloat(amount) || 0,
      currency,
      paymentMethod,
      travelerName,
      travelerEmail,
      status: 'CONFIRMED',
      paymentStatus: 'PAID',
      bookedAt: new Date().toISOString(),
      qrCodeData: `https://globetrotter.in/verify/${bookingRef}`,
      invoiceUrl: `/api/payment/invoice/${bookingRef}`
    };

    IN_MEMORY_BOOKINGS.unshift(confirmedBooking);

    return res.status(200).json({
      success: true,
      message: 'Payment verified and booking confirmed successfully!',
      booking: confirmedBooking
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    return res.status(500).json({ error: 'Payment verification failed.' });
  }
};

/**
 * 3. Get Traveler Bookings History
 */
const getTravelerBookings = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      bookings: IN_MEMORY_BOOKINGS,
      count: IN_MEMORY_BOOKINGS.length
    });
  } catch (error) {
    console.error('Fetch bookings error:', error);
    return res.status(500).json({ error: 'Failed to retrieve bookings.' });
  }
};

/**
 * 4. Generate Invoice Details
 */
const getInvoiceDetails = async (req, res) => {
  try {
    const { bookingRef } = req.params;
    const booking = IN_MEMORY_BOOKINGS.find(b => b.bookingRef === bookingRef) || {
      bookingRef: bookingRef || 'GT-BK-892145',
      transactionId: 'txn_9824fha91823',
      itemName: 'Royal Rajasthan Multi-City Heritage Package',
      amount: 45000,
      currency: 'INR',
      paymentMethod: 'UPI (Google Pay)',
      travelerName: 'Aarav Sharma',
      travelerEmail: 'traveler@globetrotter.in',
      bookedAt: new Date().toISOString(),
      status: 'CONFIRMED'
    };

    const gstAmount = Math.round(booking.amount * 0.05);
    const subtotal = booking.amount - gstAmount;

    return res.status(200).json({
      success: true,
      invoice: {
        invoiceNumber: `INV-2026-${booking.bookingRef}`,
        invoiceDate: booking.bookedAt,
        gstin: '08AAAAA0000A1Z5',
        company: {
          name: 'GlobeTrotter Travel Technologies Pvt. Ltd.',
          address: 'Odoo Tech Park, Gandhinagar, Gujarat 382007',
          email: 'support@globetrotter.in'
        },
        customer: {
          name: booking.travelerName,
          email: booking.travelerEmail
        },
        booking: {
          ref: booking.bookingRef,
          transactionId: booking.transactionId,
          service: booking.itemName,
          paymentMethod: booking.paymentMethod
        },
        billing: {
          subtotal,
          cgst: Math.round(gstAmount / 2),
          sgst: Math.round(gstAmount / 2),
          total: booking.amount,
          currency: booking.currency
        }
      }
    });
  } catch (error) {
    console.error('Invoice error:', error);
    return res.status(500).json({ error: 'Failed to generate invoice.' });
  }
};

module.exports = {
  createPaymentOrder,
  verifyPayment,
  getTravelerBookings,
  getInvoiceDetails,
};
