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
    const { name, description, coverPhoto, startDate, endDate, budgetLimit, isPublic } = req.body;

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
        budgetLimit: budgetLimit ? parseFloat(budgetLimit) : 0,
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
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json({ trips, count: trips.length });
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

// Update Trip
const updateTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, coverPhoto, startDate, endDate, budgetLimit, isPublic } = req.body;

    const trip = await prisma.trip.findUnique({
      where: { id },
    });

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found.' });
    }

    if (trip.userId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden. You can only edit your own trips.' });
    }

    const data = {};
    if (name) data.name = name;
    if (description !== undefined) data.description = description;
    if (coverPhoto !== undefined) data.coverPhoto = coverPhoto;
    if (startDate) data.startDate = new Date(startDate);
    if (endDate) data.endDate = new Date(endDate);
    if (budgetLimit !== undefined) data.budgetLimit = parseFloat(budgetLimit);

    if (isPublic !== undefined) {
      data.isPublic = Boolean(isPublic);
      if (data.isPublic && !trip.shareSlug) {
        data.shareSlug = generateSlug(name || trip.name);
      }
    }

    const updatedTrip = await prisma.trip.update({
      where: { id },
      data,
      include: {
        stops: {
          include: {
            city: true,
            activities: true,
          },
          orderBy: { order: 'asc' },
        },
      },
    });

    return res.status(200).json({ message: 'Trip updated successfully', trip: updatedTrip });
  } catch (error) {
    console.error('Update trip error:', error);
    return res.status(500).json({ error: 'Internal server error updating trip.' });
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

// Get Public Shared Trip by Share Slug
const getPublicTripBySlug = async (req, res) => {
  try {
    const { shareSlug } = req.params;

    const trip = await prisma.trip.findUnique({
      where: { shareSlug },
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

    if (!trip || !trip.isPublic) {
      return res.status(404).json({ error: 'Public trip not found or link has expired.' });
    }

    return res.status(200).json({ trip });
  } catch (error) {
    console.error('Public trip view error:', error);
    return res.status(500).json({ error: 'Failed to fetch public trip.' });
  }
};

// Copy/Clone Public Trip to User's Profile
const copyPublicTrip = async (req, res) => {
  try {
    const { shareSlug } = req.params;

    const sourceTrip = await prisma.trip.findUnique({
      where: { shareSlug },
      include: {
        stops: {
          include: {
            activities: true,
          },
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!sourceTrip || !sourceTrip.isPublic) {
      return res.status(404).json({ error: 'Public trip not found to copy.' });
    }

    // Create duplicate trip for the current user
    const copiedTrip = await prisma.trip.create({
      data: {
        name: `Copy of ${sourceTrip.name}`,
        description: sourceTrip.description,
        coverPhoto: sourceTrip.coverPhoto,
        startDate: sourceTrip.startDate,
        endDate: sourceTrip.endDate,
        budgetLimit: sourceTrip.budgetLimit,
        isPublic: false,
        userId: req.user.id,
      },
    });

    // Copy stops & activities
    for (const stop of sourceTrip.stops) {
      const newStop = await prisma.stop.create({
        data: {
          tripId: copiedTrip.id,
          cityId: stop.cityId,
          startDate: stop.startDate,
          endDate: stop.endDate,
          order: stop.order,
        },
      });

      for (const act of stop.activities) {
        await prisma.activity.create({
          data: {
            stopId: newStop.id,
            name: act.name,
            description: act.description,
            category: act.category,
            cost: act.cost,
            duration: act.duration,
            imageUrl: act.imageUrl,
          },
        });
      }
    }

    return res.status(201).json({ message: 'Trip copied to your account successfully', tripId: copiedTrip.id });
  } catch (error) {
    console.error('Copy trip error:', error);
    return res.status(500).json({ error: 'Failed to copy trip.' });
  }
};

module.exports = {
  createTrip,
  getTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  getPublicTripBySlug,
  copyPublicTrip,
};
