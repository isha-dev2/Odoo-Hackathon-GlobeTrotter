const prisma = require('../config/db');

// Search & List Cities
const getCities = async (req, res) => {
  try {
    const { q, country, minCost, maxCost, sortBy = 'popularity', order = 'desc' } = req.query;

    const where = {};

    if (q) {
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { country: { contains: q, mode: 'insensitive' } },
      ];
    }

    if (country) {
      where.country = { contains: country, mode: 'insensitive' };
    }

    if (minCost || maxCost) {
      where.costIndex = {};
      if (minCost) where.costIndex.gte = parseFloat(minCost);
      if (maxCost) where.costIndex.lte = parseFloat(maxCost);
    }

    const orderBy = {};
    if (['popularity', 'costIndex', 'name'].includes(sortBy)) {
      orderBy[sortBy] = order.toLowerCase() === 'asc' ? 'asc' : 'desc';
    } else {
      orderBy.popularity = 'desc';
    }

    const cities = await prisma.city.findMany({
      where,
      orderBy,
    });

    return res.status(200).json({ cities, count: cities.length });
  } catch (error) {
    console.error('Error fetching cities:', error);
    return res.status(500).json({ error: 'Failed to fetch cities.' });
  }
};

// Get Single City
const getCityById = async (req, res) => {
  try {
    const { id } = req.params;
    const city = await prisma.city.findUnique({
      where: { id },
      include: {
        stops: {
          select: { id: true, tripId: true },
        },
      },
    });

    if (!city) {
      return res.status(404).json({ error: 'City not found.' });
    }

    return res.status(200).json({ city });
  } catch (error) {
    console.error('Error fetching city:', error);
    return res.status(500).json({ error: 'Failed to fetch city details.' });
  }
};

// Admin Create City
const createCity = async (req, res) => {
  try {
    const { name, country, costIndex, popularity, imageUrl } = req.body;

    if (!name || !country) {
      return res.status(400).json({ error: 'City name and country are required.' });
    }

    const city = await prisma.city.create({
      data: {
        name,
        country,
        costIndex: costIndex ? parseFloat(costIndex) : 50.0,
        popularity: popularity ? parseInt(popularity) : 50,
        imageUrl: imageUrl || null,
      },
    });

    return res.status(201).json({ message: 'City created successfully', city });
  } catch (error) {
    console.error('Error creating city:', error);
    return res.status(500).json({ error: 'Failed to create city.' });
  }
};

module.exports = {
  getCities,
  getCityById,
  createCity,
};
