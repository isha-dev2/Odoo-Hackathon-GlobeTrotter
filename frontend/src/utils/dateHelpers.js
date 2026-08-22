/**
 * Date and Time Processing Utilities for GlobeTrotter
 */

/**
 * Calculates day difference between two dates
 */
export function getDurationDays(startDate, endDate) {
  const s = new Date(startDate);
  const e = new Date(endDate);
  if (isNaN(s.getTime()) || isNaN(e.getTime())) return 1;
  const diffTime = Math.abs(e - s);
  return Math.max(1, Math.round(diffTime / (1000 * 60 * 60 * 24)));
}

/**
 * Formats date range into readable string e.g. "1 Oct - 8 Oct, 2026"
 */
export function formatDateRange(startDate, endDate) {
  const s = new Date(startDate);
  const e = new Date(endDate);
  if (isNaN(s.getTime()) || isNaN(e.getTime())) return 'Flexible Dates';

  const options = { day: 'numeric', month: 'short' };
  const startStr = s.toLocaleDateString('en-US', options);
  const endStr = e.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

  return `${startStr} – ${endStr}`;
}

/**
 * Checks if a trip is happening in the future, currently ongoing, or completed
 */
export function getTripStatus(startDate, endDate) {
  const now = new Date();
  const s = new Date(startDate);
  const e = new Date(endDate);

  if (now < s) return { label: 'Upcoming', color: '#0d9488', bg: '#f0fdf9' };
  if (now >= s && now <= e) return { label: 'Ongoing Now', color: '#16a34a', bg: '#ecfdf5' };
  return { label: 'Completed', color: '#64748b', bg: '#f1f5f9' };
}
