/**
 * Automated Tests for AI Travel Agent Planning Engine
 */

describe('AI Travel Agent Planner Suite', () => {
  const parsePrompt = (text) => {
    const destinations = ['Jaipur', 'Goa', 'Kerala', 'Manali', 'Dubai', 'Paris', 'Tokyo'];
    const matchedDest = destinations.find(d => text.toLowerCase().includes(d.toLowerCase())) || 'Custom Destination';
    const daysMatch = text.match(/(\d+)\s*(days|day)/i);
    const budgetMatch = text.match(/(?:₹|\$|rs\.?|inr)?\s*([\d,]+)/i);

    const days = daysMatch ? parseInt(daysMatch[1]) : 5;
    const budget = budgetMatch ? parseInt(budgetMatch[1].replace(/,/g, '')) : 35000;

    return {
      destination: matchedDest,
      days,
      budget,
      title: `${matchedDest} ${days}-Day Adventure`
    };
  };

  test('parses Indian travel prompt with INR budget and duration', () => {
    const prompt = 'Plan a 7 days trip to Jaipur under 45000';
    const plan = parsePrompt(prompt);

    expect(plan.destination).toBe('Jaipur');
    expect(plan.days).toBe(7);
    expect(plan.budget).toBe(45000);
    expect(plan.title).toBe('Jaipur 7-Day Adventure');
  });

  test('parses international destination with custom duration', () => {
    const prompt = 'Romantic 6 days escape in Paris';
    const plan = parsePrompt(prompt);

    expect(plan.destination).toBe('Paris');
    expect(plan.days).toBe(6);
  });
});
