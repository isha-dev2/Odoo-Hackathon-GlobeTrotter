const prisma = require('../config/db');

// Helper to generate unique slug for public trips
const generateSlug = (name) => {
  const cleanName = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `${cleanName}-${randomStr}`;
};

// Create Trip
const createTrip = async (req, res) => {
  try {
    const { name, description, coverPhoto, startDate, endDate, isPublic } = req.body;

    if (!name || !startDate || !endDate) {
      return res.status(400).json({ error: 'Trip name, startDate, and endDate are required.' });
    }

    const shareSlug = isPublic ? generateSlug(name) : null;

    const trip = await prisma.trip.create({
      data: {
        name,
        description: description || null,
        coverPhoto: coverPhoto || null,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        isPublic: Boolean(isPublic),
        shareSlug,
        userId: req.user.id,
      },
    });

    return res.status(201).json({ message: 'Trip created successfully', trip });
  } catch (error) {
    console.error('Create trip error:', error);
    return res.status(500).json({ error: 'Internal server error creating trip.' });
  }
};

// Get All Trips for Logged-In User
const getTrips = async (req, res) => {
  try {
    const trips = await prisma.trip.findMany({
      where: { userId: req.user.id },
      include: {
        stops: {
          include: {
            city: true,
            activities: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json({ trips });
  } catch (error) {
    console.error('Get trips error:', error);
    return res.status(500).json({ error: 'Internal server error fetching trips.' });
  }
};

// Get Trip by ID
const getTripById = async (req, res) => {
  try {
    const { id } = req.params;

    const trip = await prisma.trip.findUnique({
      where: { id },
      include: {
        stops: {
          include: {
            city: true,
            activities: true,
          },
          orderBy: { order: 'asc' },
        },
        user: {
          select: {
            id: true,
            name: true,
            photo: true,
          },
        },
      },
    });

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found.' });
    }

    // Check authorization: must be owner or trip must be public
    if (trip.userId !== req.user.id && !trip.isPublic) {
      return res.status(403).json({ error: 'Forbidden. You do not have access to this trip.' });
    }

    return res.status(200).json({ trip });
  } catch (error) {
    console.error('Get trip by ID error:', error);
    return res.status(500).json({ error: 'Internal server error fetching trip.' });
  }
};

// Delete Trip
const deleteTrip = async (req, res) => {
  try {
    const { id } = req.params;

    const trip = await prisma.trip.findUnique({
      where: { id },
    });

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found.' });
    }

    if (trip.userId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden. You can only delete your own trips.' });
    }

    await prisma.trip.delete({
      where: { id },
    });

    return res.status(200).json({ message: 'Trip deleted successfully.' });
  } catch (error) {
    console.error('Delete trip error:', error);
    return res.status(500).json({ error: 'Internal server error deleting trip.' });
  }
};

module.exports = {
  createTrip,
  getTrips,
  getTripById,
  deleteTrip,
};
