/**
 * Automated Unit Tests for City Directory & Search Filters
 */

describe('City Directory & Geographic Lookup Suite', () => {
  const cities = [
    { name: 'Jaipur', country: 'India', region: 'India', costIndex: 45, popularity: 98 },
    { name: 'Goa', country: 'India', region: 'India', costIndex: 50, popularity: 99 },
    { name: 'Munnar & Alleppey', country: 'India', region: 'India', costIndex: 40, popularity: 97 },
    { name: 'Dubai', country: 'United Arab Emirates', region: 'Middle East', costIndex: 88, popularity: 98 },
    { name: 'Paris', country: 'France', region: 'Europe', costIndex: 85, popularity: 98 },
  ];

  test('filters destinations accurately by country query', () => {
    const indianCities = cities.filter(c => c.country.toLowerCase().includes('india'));
    expect(indianCities.length).toBe(3);
    expect(indianCities.map(c => c.name)).toContain('Jaipur');
  });

  test('filters destinations by maximum cost index constraint', () => {
    const budgetCities = cities.filter(c => c.costIndex <= 50);
    expect(budgetCities.length).toBe(3);
  });

  test('sorts destinations by popularity score in descending order', () => {
    const sorted = [...cities].sort((a, b) => b.popularity - a.popularity);
    expect(sorted[0].name).toBe('Goa');
    expect(sorted[0].popularity).toBe(99);
  });
});
