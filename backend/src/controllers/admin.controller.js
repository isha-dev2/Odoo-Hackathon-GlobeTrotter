const prisma = require('../config/db');

// Admin Platform Analytics
const getAnalytics = async (req, res) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalTrips = await prisma.trip.count();
    const totalStops = await prisma.stop.count();
    const totalActivities = await prisma.activity.count();

    // Top cities included in stops
    const stopCityGroups = await prisma.stop.groupBy({
      by: ['cityId'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 5,
    });

    const topCityIds = stopCityGroups.map(g => g.cityId);
    const topCitiesList = await prisma.city.findMany({
      where: { id: { in: topCityIds } },
    });

    const topCities = stopCityGroups.map(g => {
      const city = topCitiesList.find(c => c.id === g.cityId);
      return {
        cityId: g.cityId,
        cityName: city ? `${city.name}, ${city.country}` : 'Unknown',
        stopCount: g._count.id,
      };
    });

    // Public vs Private trips ratio
    const publicTripsCount = await prisma.trip.count({ where: { isPublic: true } });
    const privateTripsCount = totalTrips - publicTripsCount;

    return res.status(200).json({
      overview: {
        totalUsers,
        totalTrips,
        totalStops,
        totalActivities,
        publicTripsCount,
        privateTripsCount,
      },
      topBookedCities: topCities,
    });
  } catch (error) {
    console.error('Error fetching admin analytics:', error);
    return res.status(500).json({ error: 'Failed to fetch platform analytics.' });
  }
};

module.exports = {
  getAnalytics,
};
