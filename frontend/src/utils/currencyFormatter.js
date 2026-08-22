/**
 * Currency Formatter Utility with Indian & International Locales
 */

export const CURRENCY_SYMBOLS = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
};

/**
 * Formats a numeric amount with appropriate currency symbol and locale formatting
 * @param {number} amount
 * @param {string} currencyCode - 'INR' | 'USD' | 'EUR' | 'GBP' | 'JPY'
 * @returns {string}
 */
export function formatCurrency(amount = 0, currencyCode = 'INR') {
  const symbol = CURRENCY_SYMBOLS[currencyCode] || '₹';
  const num = Math.round(Number(amount) || 0);

  if (currencyCode === 'INR') {
    // Format according to Indian Numbering System (e.g. 1,50,000)
    return `${symbol}${num.toLocaleString('en-IN')}`;
  }

  return `${symbol}${num.toLocaleString('en-US')}`;
}

/**
 * Converts an amount from base INR to target currency based on exchange rates
 */
export function convertFromInr(amountInr = 0, targetCurrency = 'INR') {
  const RATES_FROM_INR = {
    INR: 1,
    USD: 0.012,
    EUR: 0.011,
    GBP: 0.0095,
    JPY: 1.85,
  };

  const rate = RATES_FROM_INR[targetCurrency] || 1;
  return Math.round(amountInr * rate);
}
