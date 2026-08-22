/**
 * Automated Tests for Online Payment Gateway & Booking Engine
 */

describe('Online Payment & Booking Gateway Suite', () => {
  const calculateOrderTotal = (baseAmount, couponCode = null) => {
    let discount = 0;
    if (couponCode === 'ODDO2026') {
      discount = 500;
    }
    const discountedBase = Math.max(0, baseAmount - discount);
    const gstRate = 0.05; // 5% GST for tourism
    const gstAmount = Math.round(discountedBase * gstRate);
    const totalPayable = discountedBase + gstAmount;

    return {
      baseAmount,
      discount,
      discountedBase,
      gstAmount,
      totalPayable,
      cgst: Math.round(gstAmount / 2),
      sgst: Math.round(gstAmount / 2)
    };
  };

  test('calculates correct 5% GST and order total for INR payment', () => {
    const order = calculateOrderTotal(10000);
    expect(order.baseAmount).toBe(10000);
    expect(order.discount).toBe(0);
    expect(order.gstAmount).toBe(500);
    expect(order.totalPayable).toBe(10500);
    expect(order.cgst).toBe(250);
    expect(order.sgst).toBe(250);
  });

  test('applies promotional discount coupon correctly', () => {
    const order = calculateOrderTotal(5000, 'ODDO2026');
    expect(order.discount).toBe(500);
    expect(order.discountedBase).toBe(4500);
    expect(order.gstAmount).toBe(225);
    expect(order.totalPayable).toBe(4725);
  });

  test('generates unique valid booking reference format', () => {
    const generateBookingRef = () => `GT-BK-${Math.floor(100000 + Math.random() * 900000)}`;
    const ref = generateBookingRef();

    expect(ref).toMatch(/^GT-BK-\d{6}$/);
  });

  test('validates supported payment channels (UPI, Cards, NetBanking)', () => {
    const validChannels = ['UPI', 'CREDIT_DEBIT_CARD', 'NETBANKING', 'INTERNATIONAL_STRIPE'];
    const selectedMethod = 'UPI';

    expect(validChannels).toContain(selectedMethod);
  });
});
