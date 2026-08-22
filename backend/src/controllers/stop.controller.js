const prisma = require('../config/db');

// Add Stop to Trip
const addStop = async (req, res) => {
  try {
    const { tripId, cityId, startDate, endDate, order } = req.body;

    if (!tripId || !cityId || !startDate || !endDate) {
      return res.status(400).json({ error: 'tripId, cityId, startDate, and endDate are required.' });
    }

    // Verify trip exists and belongs to user
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
    });

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found.' });
    }

    if (trip.userId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden. You do not own this trip.' });
    }

    // Verify city exists
    const city = await prisma.city.findUnique({
      where: { id: cityId },
    });

    if (!city) {
      return res.status(404).json({ error: 'City not found.' });
    }

    // Determine stop order if not passed
    let stopOrder = order;
    if (stopOrder === undefined || stopOrder === null) {
      const stopCount = await prisma.stop.count({ where: { tripId } });
      stopOrder = stopCount;
    }

    const stop = await prisma.stop.create({
      data: {
        tripId,
        cityId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        order: parseInt(stopOrder),
      },
      include: {
        city: true,
        activities: true,
      },
    });

    return res.status(201).json({ message: 'Stop added to trip successfully', stop });
  } catch (error) {
    console.error('Error adding stop:', error);
    return res.status(500).json({ error: 'Failed to add stop to trip.' });
  }
};

// Update Stop (dates, order)
const updateStop = async (req, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate, order } = req.body;

    const stop = await prisma.stop.findUnique({
      where: { id },
      include: { trip: true },
    });

    if (!stop) {
      return res.status(404).json({ error: 'Stop not found.' });
    }

    if (stop.trip.userId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden. You do not own this trip.' });
    }

    const data = {};
    if (startDate) data.startDate = new Date(startDate);
    if (endDate) data.endDate = new Date(endDate);
    if (order !== undefined) data.order = parseInt(order);

    const updatedStop = await prisma.stop.update({
      where: { id },
      data,
      include: {
        city: true,
        activities: true,
      },
    });

    return res.status(200).json({ message: 'Stop updated successfully', stop: updatedStop });
  } catch (error) {
    console.error('Error updating stop:', error);
    return res.status(500).json({ error: 'Failed to update stop.' });
  }
};

// Delete Stop
const deleteStop = async (req, res) => {
  try {
    const { id } = req.params;

    const stop = await prisma.stop.findUnique({
      where: { id },
      include: { trip: true },
    });

    if (!stop) {
      return res.status(404).json({ error: 'Stop not found.' });
    }

    if (stop.trip.userId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden. You do not own this trip.' });
    }

    await prisma.stop.delete({ where: { id } });

    return res.status(200).json({ message: 'Stop deleted successfully.' });
  } catch (error) {
    console.error('Error deleting stop:', error);
    return res.status(500).json({ error: 'Failed to delete stop.' });
  }
};

module.exports = {
  addStop,
  updateStop,
  deleteStop,
};
