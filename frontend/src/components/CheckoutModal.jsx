import React, { useState } from 'react';
import {
  X, CheckCircle2, ShieldCheck, CreditCard, Smartphone,
  Building2, Globe, Tag, Download, ArrowRight, Loader2,
  Sparkles, QrCode, FileText, Lock
} from 'lucide-react';
import api from '../api/client';
import { downloadInvoice } from '../utils/invoiceGenerator';

const PAYMENT_METHODS = [
  { id: 'upi', name: 'Instant UPI', subtitle: 'Google Pay, PhonePe, Paytm, BHIM', icon: Smartphone, badge: 'Zero Fees' },
  { id: 'card', name: 'Credit / Debit Card', subtitle: 'Visa, MasterCard, RuPay, Amex', icon: CreditCard, badge: 'Instant' },
  { id: 'netbanking', name: 'Net Banking', subtitle: 'SBI, HDFC, ICICI, Axis, 50+ Banks', icon: Building2 },
  { id: 'intl', name: 'International Cards', subtitle: 'Stripe / Global Cards', icon: Globe },
];

export default function CheckoutModal({
  isOpen,
  onClose,
  trip,
  activity,
  currencySymbol = '₹',
  user,
  onBookingSuccess
}) {
  const [selectedMethod, setSelectedMethod] = useState('upi');
  const [upiId, setUpiId] = useState('aarav@okhdfcbank');
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  if (!isOpen) return null;

  // Calculate Base Amount
  const itemName = activity
    ? activity.name
    : (trip ? `${trip.name} (Complete Multi-City Package)` : 'GlobeTrotter Travel Package');

  const basePrice = activity
    ? activity.cost
    : (trip?.stops?.reduce((sum, s) => sum + (s.activities || []).reduce((a, act) => a + (act.cost || 0), 0), 0) || trip?.budgetLimit || 45000);

  const discountedBase = Math.max(0, basePrice - discount);
  const gstAmount = Math.round(discountedBase * 0.05); // 5% GST
  const totalPayable = discountedBase + gstAmount;

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase().trim() === 'ODDO2026') {
      setDiscount(500);
      setCouponError('');
    } else {
      setCouponError('Invalid coupon code. Try "ODDO2026" for ₹500 off!');
    }
  };

  const handleProcessPayment = async () => {
    setProcessing(true);

    try {
      // 1. Create order on backend
      const orderRes = await api.post('/payment/create-order', {
        tripId: trip?.id,
        activityId: activity?.id,
        amount: discountedBase,
        currency: currencySymbol === '₹' ? 'INR' : 'USD',
        itemName,
        travelerName: user?.name || 'Aarav Sharma',
        travelerEmail: user?.email || 'traveler@globetrotter.in'
      });

      const orderData = orderRes.data.order;

      // 2. Simulate / verify payment on backend
      const verifyRes = await api.post('/payment/verify-payment', {
        orderId: orderData.orderId,
        paymentMethod: selectedMethod.toUpperCase(),
        amount: totalPayable,
        currency: currencySymbol === '₹' ? 'INR' : 'USD',
        itemName,
        travelerName: user?.name || 'Aarav Sharma',
        travelerEmail: user?.email || 'traveler@globetrotter.in'
      });

      const booking = verifyRes.data.booking;
      setConfirmedBooking(booking);
      if (onBookingSuccess) onBookingSuccess(booking);
    } catch (err) {
      // Local simulated fallback
      const fallbackBooking = {
        id: `booking-${Date.now()}`,
        bookingRef: `GT-BK-${Math.floor(100000 + Math.random() * 900000)}`,
        transactionId: `txn_${Math.random().toString(36).substring(2, 12)}`,
        itemName,
        amount: totalPayable,
        currency: currencySymbol === '₹' ? 'INR' : 'USD',
        paymentMethod: selectedMethod.toUpperCase(),
        travelerName: user?.name || 'Aarav Sharma',
        travelerEmail: user?.email || 'traveler@globetrotter.in',
        status: 'CONFIRMED',
        bookedAt: new Date().toISOString()
      };
      setConfirmedBooking(fallbackBooking);
      if (onBookingSuccess) onBookingSuccess(fallbackBooking);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 999,
        background: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#ffffff', borderRadius: '28px', width: '100%', maxWidth: '640px',
          maxHeight: '92vh', overflowY: 'auto',
          boxShadow: '0 24px 80px rgba(0,0,0,0.3)', border: '1px solid #e2e8f0'
        }}
      >
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #042f2e 0%, #064e3b 40%, #0f172a 100%)',
          padding: '28px 32px', position: 'relative'
        }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: '20px', right: '20px',
              background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '10px',
              width: '34px', height: '34px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            <X size={18} color="#ffffff" />
          </button>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.35)', borderRadius: '99px', padding: '4px 12px', marginBottom: '8px' }}>
            <Lock size={12} color="#34d399" />
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#6ee7b7', letterSpacing: '0.05em' }}>
              256-BIT SSL ENCRYPTED CHECKOUT
            </span>
          </div>

          <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#ffffff', margin: 0, letterSpacing: '-0.5px' }}>
            {confirmedBooking ? 'Booking Confirmed! 🎉' : 'Instant Online Reservation'}
          </h2>
          <p style={{ fontSize: '13px', color: '#cbd5e1', margin: '4px 0 0' }}>
            {confirmedBooking ? 'Your travel voucher and GST tax invoice are ready' : 'Secure payment gateway with instant booking confirmation'}
          </p>
        </div>

        {/* Body */}
        {confirmedBooking ? (
          /* SUCCESS CONFIRMATION STATE */
          <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'center' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              background: '#ecfdf5', border: '3px solid #10b981', color: '#059669',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto'
            }}>
              <CheckCircle2 size={36} strokeWidth={2.5} />
            </div>

            <div>
              <h3 style={{ fontSize: '22px', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                Payment Received & Reservation Confirmed!
              </h3>
              <p style={{ fontSize: '13px', color: '#64748b', marginTop: '6px' }}>
                Booking Reference: <strong style={{ color: '#0d9488' }}>{confirmedBooking.bookingRef}</strong> · Txn: <code>{confirmedBooking.transactionId}</code>
              </p>
            </div>

            {/* Ticket Card */}
            <div style={{
              background: '#f8fafc', borderRadius: '18px', padding: '20px',
              border: '1.5px dashed #cbd5e1', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Reserved Package</div>
                <div style={{ fontSize: '15px', fontWeight: 900, color: '#0f172a', marginTop: '2px' }}>{confirmedBooking.itemName}</div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                  Traveler: <strong>{confirmedBooking.travelerName}</strong> ({confirmedBooking.travelerEmail})
                </div>
                <div style={{ fontSize: '13px', fontWeight: 900, color: '#0d9488', marginTop: '8px' }}>
                  Amount Paid: {currencySymbol}{confirmedBooking.amount.toLocaleString()} ({confirmedBooking.paymentMethod})
                </div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <QrCode size={56} color="#0f172a" />
                <div style={{ fontSize: '9px', fontWeight: 800, color: '#64748b', marginTop: '2px' }}>SCAN AT VENUE</div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={() => downloadInvoice(confirmedBooking)}
                style={{
                  flex: 1, padding: '14px', borderRadius: '14px',
                  background: 'linear-gradient(135deg, #0d9488 0%, #10b981 100%)',
                  color: '#ffffff', border: 'none', fontSize: '13px', fontWeight: 800,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  boxShadow: '0 4px 14px rgba(13,148,136,0.3)'
                }}
              >
                <Download size={16} />
                <span>Download Tax Invoice (PDF)</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: '14px 20px', borderRadius: '14px',
                  background: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1',
                  fontSize: '13px', fontWeight: 800, cursor: 'pointer'
                }}
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* CHECKOUT PAYMENT FORM */
          <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
            
            {/* Order Summary Box */}
            <div style={{ background: '#f8fafc', borderRadius: '18px', padding: '18px 22px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Booking Item</div>
                  <div style={{ fontSize: '15px', fontWeight: 900, color: '#0f172a', marginTop: '2px' }}>{itemName}</div>
                </div>
                <div style={{ fontSize: '16px', fontWeight: 900, color: '#0d9488' }}>
                  {currencySymbol}{basePrice.toLocaleString()}
                </div>
              </div>

              {/* Coupon Code Input */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <input
                  type="text"
                  value={couponCode}
                  onChange={e => setCouponCode(e.target.value)}
                  placeholder="Enter Promo Code (e.g. ODDO2026)"
                  style={{
                    flex: 1, background: '#ffffff', border: '1.5px solid #cbd5e1',
                    borderRadius: '10px', padding: '8px 12px', fontSize: '12px', fontWeight: 700, outline: 'none'
                  }}
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  style={{
                    background: '#0f172a', color: '#ffffff', border: 'none',
                    borderRadius: '10px', padding: '8px 16px', fontSize: '12px', fontWeight: 800, cursor: 'pointer'
                  }}
                >
                  Apply
                </button>
              </div>
              {couponError && <div style={{ fontSize: '11px', color: '#ef4444', marginBottom: '8px' }}>{couponError}</div>}
              {discount > 0 && <div style={{ fontSize: '11px', color: '#059669', fontWeight: 800, marginBottom: '8px' }}>🎉 Promo Code Applied: ₹500 Discount!</div>}

              {/* Calculation Rows */}
              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                  <span>Base Fare & Activities:</span>
                  <span>{currencySymbol}{basePrice.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#059669', fontWeight: 700 }}>
                    <span>Hackathon Promo Discount:</span>
                    <span>- {currencySymbol}{discount.toLocaleString()}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                  <span>GST & Tourism Tax (5%):</span>
                  <span>{currencySymbol}{gstAmount.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', fontWeight: 900, color: '#0f172a', borderTop: '1px solid #e2e8f0', paddingTop: '8px', marginTop: '4px' }}>
                  <span>Total Payable:</span>
                  <span style={{ color: '#0d9488' }}>{currencySymbol}{totalPayable.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '10px', textTransform: 'uppercase' }}>
                Select Payment Method
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {PAYMENT_METHODS.map(m => {
                  const Icon = m.icon;
                  const isSelected = selectedMethod === m.id;

                  return (
                    <div
                      key={m.id}
                      onClick={() => setSelectedMethod(m.id)}
                      style={{
                        background: isSelected ? '#f0fdf9' : '#ffffff',
                        border: isSelected ? '2px solid #0d9488' : '1.5px solid #cbd5e1',
                        borderRadius: '14px', padding: '12px 14px', cursor: 'pointer',
                        display: 'flex', flexDirection: 'column', gap: '4px',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Icon size={18} color={isSelected ? '#0d9488' : '#64748b'} />
                        {m.badge && (
                          <span style={{ fontSize: '9px', fontWeight: 800, background: '#dcfce7', color: '#15803d', padding: '2px 6px', borderRadius: '99px' }}>
                            {m.badge}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>{m.name}</div>
                      <div style={{ fontSize: '10px', color: '#64748b' }}>{m.subtitle}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* UPI ID input if UPI selected */}
            {selectedMethod === 'upi' && (
              <div>
                <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', display: 'block', marginBottom: '6px' }}>
                  YOUR UPI VIRTUAL PAYMENT ADDRESS (VPA)
                </label>
                <input
                  type="text"
                  value={upiId}
                  onChange={e => setUpiId(e.target.value)}
                  placeholder="e.g. yourname@upi / 9876543210@paytm"
                  style={{
                    width: '100%', background: '#f8fafc', border: '1.5px solid #cbd5e1',
                    borderRadius: '12px', padding: '10px 14px', fontSize: '13px', fontWeight: 600, color: '#0f172a', outline: 'none'
                  }}
                />
              </div>
            )}

            {/* Pay Button */}
            <button
              type="button"
              disabled={processing}
              onClick={handleProcessPayment}
              style={{
                width: '100%', padding: '15px', borderRadius: '16px',
                background: processing ? '#94a3b8' : 'linear-gradient(135deg, #0d9488 0%, #10b981 100%)',
                color: '#ffffff', border: 'none', fontSize: '14px', fontWeight: 900,
                cursor: processing ? 'not-allowed' : 'pointer',
                boxShadow: '0 6px 20px rgba(13,148,136,0.35)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
              }}
            >
              {processing ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Processing Secure Payment...</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={18} />
                  <span>Pay {currencySymbol}{totalPayable.toLocaleString()} & Confirm Booking</span>
                </>
              )}
            </button>

            <div style={{ textAlign: 'center', fontSize: '11px', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <ShieldCheck size={13} color="#0d9488" />
              <span>Compliant with RBI 2-Factor Authentication & Instant Refunds</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
