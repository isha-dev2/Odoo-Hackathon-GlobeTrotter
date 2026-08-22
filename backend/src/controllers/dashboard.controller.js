const prisma = require('../config/db');

// Home Dashboard Data Hub
const getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch user details
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, photo: true },
    });

    // Fetch user's trips
    const trips = await prisma.trip.findMany({
      where: { userId },
      include: {
        stops: {
          include: {
            city: true,
            activities: true,
          },
        },
      },
      orderBy: { startDate: 'asc' },
    });

    // Calculate user stats
    const totalTrips = trips.length;
    let totalCitiesVisited = 0;
    let totalEstimatedBudget = 0;

    const citySet = new Set();
    trips.forEach((t) => {
      totalEstimatedBudget += t.budgetLimit || 0;
      t.stops.forEach((s) => {
        if (s.cityId) citySet.add(s.cityId);
      });
    });
    totalCitiesVisited = citySet.size;

    // Recommended top cities
    const recommendedCities = await prisma.city.findMany({
      take: 6,
      orderBy: { popularity: 'desc' },
    });

    return res.status(200).json({
      user,
      stats: {
        totalTrips,
        totalCitiesVisited,
        totalEstimatedBudget: parseFloat(totalEstimatedBudget.toFixed(2)),
      },
      recentTrips: trips.slice(0, 3),
      allTrips: trips,
      recommendedCities,
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return res.status(500).json({ error: 'Failed to fetch dashboard data.' });
  }
};

module.exports = {
  getDashboardData,
};
