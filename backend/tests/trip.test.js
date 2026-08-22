/**
 * Automated Unit Tests for Trip & Itinerary Calculations
 */

describe('GlobeTrotter Trip & Itinerary Suite', () => {
  const sampleTrip = {
    id: 'test-trip-1',
    name: 'Royal Rajasthan Heritage',
    budgetLimit: 45000,
    startDate: '2026-10-01',
    endDate: '2026-10-08',
    stops: [
      {
        id: 'stop-1',
        city: 'Jaipur',
        order: 1,
        activities: [
          { id: 'act-1', name: 'Amber Fort Safari', cost: 1500, duration: 180 },
          { id: 'act-2', name: 'Chokhi Dhani Dinner', cost: 1200, duration: 210 }
        ]
      },
      {
        id: 'stop-2',
        city: 'Udaipur',
        order: 2,
        activities: [
          { id: 'act-3', name: 'Lake Pichola Boat Cruise', cost: 1100, duration: 120 }
        ]
      }
    ]
  };

  test('calculates correct trip duration in days', () => {
    const start = new Date(sampleTrip.startDate);
    const end = new Date(sampleTrip.endDate);
    const days = Math.round((end - start) / (1000 * 60 * 60 * 24));
    expect(days).toBe(7);
  });

  test('calculates total activities scheduled across all stops', () => {
    const totalActivities = sampleTrip.stops.reduce((acc, s) => acc + s.activities.length, 0);
    expect(totalActivities).toBe(3);
  });

  test('calculates total estimated activities expenditure', () => {
    const totalCost = sampleTrip.stops.reduce(
      (sum, s) => sum + s.activities.reduce((a, act) => a + act.cost, 0),
      0
    );
    expect(totalCost).toBe(3800);
  });

  test('verifies budget limit overdraft condition', () => {
    const totalExpenditure = 3800;
    const isOverBudget = totalExpenditure > sampleTrip.budgetLimit;
    expect(isOverBudget).toBe(false);
  });

  test('ensures correct sequential ordering of multi-city stops', () => {
    const orders = sampleTrip.stops.map(s => s.order);
    expect(orders).toEqual([1, 2]);
  });
});
