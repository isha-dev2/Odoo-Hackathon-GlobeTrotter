const prisma = require('../config/db');

// Get Financial & Budget Breakdown for a Trip
const getTripBudget = async (req, res) => {
  try {
    const { tripId } = req.params;

    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        stops: {
          include: {
            city: true,
            activities: true,
          },
        },
      },
    });

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found.' });
    }

    // Check authorization: must be owner or public
    if (trip.userId !== req.user.id && !trip.isPublic) {
      return res.status(403).json({ error: 'Forbidden. You do not have access to this trip.' });
    }

    // Calculate total duration in days
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    const totalDays = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));

    let totalActivityCost = 0;
    const categoryBreakdown = {};
    const cityBreakdown = {};

    trip.stops.forEach((stop) => {
      const cityName = stop.city ? `${stop.city.name}, ${stop.city.country}` : 'Unknown City';
      if (!cityBreakdown[cityName]) {
        cityBreakdown[cityName] = 0;
      }

      stop.activities.forEach((activity) => {
        const cost = activity.cost || 0;
        totalActivityCost += cost;

        // Category grouping
        const cat = activity.category || 'General';
        categoryBreakdown[cat] = (categoryBreakdown[cat] || 0) + cost;

        // City grouping
        cityBreakdown[cityName] += cost;
      });
    });

    const averageCostPerDay = parseFloat((totalActivityCost / totalDays).toFixed(2));
    const budgetLimit = trip.budgetLimit || 0;
    const isOverBudget = budgetLimit > 0 && totalActivityCost > budgetLimit;
    const remainingBudget = budgetLimit > 0 ? parseFloat((budgetLimit - totalActivityCost).toFixed(2)) : null;

    return res.status(200).json({
      tripId: trip.id,
      tripName: trip.name,
      totalDays,
      budgetLimit,
      totalActivityCost: parseFloat(totalActivityCost.toFixed(2)),
      averageCostPerDay,
      remainingBudget,
      isOverBudget,
      status: isOverBudget ? 'over_budget' : 'under_budget',
      categoryBreakdown,
      cityBreakdown,
    });
  } catch (error) {
    console.error('Error fetching trip budget:', error);
    return res.status(500).json({ error: 'Failed to calculate trip budget.' });
  }
};

module.exports = {
  getTripBudget,
};
