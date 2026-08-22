const prisma = require('../config/db');

// Sample activity catalog templates for discovery
const ACTIVITY_CATALOG = [
  { name: 'Eiffel Tower Summit Access', category: 'Sightseeing', cost: 35, duration: 180, description: 'Panoramic views over Paris from the summit.' },
  { name: 'Louvre Museum Guided Tour', category: 'Culture', cost: 65, duration: 240, description: 'Explore Mona Lisa and classic masterpieces.' },
  { name: 'Traditional Ramen Workshop', category: 'Food', cost: 45, duration: 120, description: 'Learn to craft authentic Japanese ramen noodles.' },
  { name: 'Shibuya Crossing & Night Food Crawl', category: 'Food', cost: 50, duration: 180, description: 'Taste street skewers and Izakaya treats.' },
  { name: 'Statue of Liberty & Ellis Island Cruise', category: 'Sightseeing', cost: 30, duration: 210, description: 'Ferry tour around New York harbour.' },
  { name: 'Colosseum Underground Experience', category: 'Sightseeing', cost: 55, duration: 150, description: 'Step onto the arena floor of ancient Rome.' },
  { name: 'Sagrada Familia Fast-Track & Towers', category: 'Culture', cost: 40, duration: 120, description: 'Gaudí masterpiece architectural tour.' },
  { name: 'Ubud Sacred Monkey Forest & Rice Terraces', category: 'Adventure', cost: 25, duration: 300, description: 'Nature trek through Bali greenery.' },
  { name: 'Desert Safari with Dune Bashing & BBQ', category: 'Adventure', cost: 75, duration: 360, description: '4x4 safari with camel riding and dinner.' },
];

// Get Activity Catalog (preset ideas for users to add)
const getActivityCatalog = async (req, res) => {
  try {
    const { category, maxCost, maxDuration, q } = req.query;

    let filtered = ACTIVITY_CATALOG;

    if (category) {
      filtered = filtered.filter(a => a.category.toLowerCase() === category.toLowerCase());
    }

    if (maxCost) {
      filtered = filtered.filter(a => a.cost <= parseFloat(maxCost));
    }

    if (maxDuration) {
      filtered = filtered.filter(a => a.duration <= parseInt(maxDuration));
    }

    if (q) {
      const term = q.toLowerCase();
      filtered = filtered.filter(a => a.name.toLowerCase().includes(term) || a.description.toLowerCase().includes(term));
    }

    return res.status(200).json({ activities: filtered, count: filtered.length });
  } catch (error) {
    console.error('Error fetching activity catalog:', error);
    return res.status(500).json({ error: 'Failed to fetch activity catalog.' });
  }
};

// Add Activity to a Stop
const addActivity = async (req, res) => {
  try {
    const { stopId, name, description, category, cost, duration, imageUrl } = req.body;

    if (!stopId || !name) {
      return res.status(400).json({ error: 'stopId and activity name are required.' });
    }

    // Verify stop belongs to a trip owned by the user
    const stop = await prisma.stop.findUnique({
      where: { id: stopId },
      include: { trip: true },
    });

    if (!stop) {
      return res.status(404).json({ error: 'Stop not found.' });
    }

    if (stop.trip.userId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden. You do not own this trip.' });
    }

    const activity = await prisma.activity.create({
      data: {
        stopId,
        name,
        description: description || null,
        category: category || 'Sightseeing',
        cost: cost ? parseFloat(cost) : 0,
        duration: duration ? parseInt(duration) : null,
        imageUrl: imageUrl || null,
      },
    });

    return res.status(201).json({ message: 'Activity added successfully', activity });
  } catch (error) {
    console.error('Error adding activity:', error);
    return res.status(500).json({ error: 'Failed to add activity.' });
  }
};

// Update Activity
const updateActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category, cost, duration, imageUrl } = req.body;

    const activity = await prisma.activity.findUnique({
      where: { id },
      include: { stop: { include: { trip: true } } },
    });

    if (!activity) {
      return res.status(404).json({ error: 'Activity not found.' });
    }

    if (activity.stop.trip.userId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden. You do not own this trip.' });
    }

    const data = {};
    if (name) data.name = name;
    if (description !== undefined) data.description = description;
    if (category) data.category = category;
    if (cost !== undefined) data.cost = parseFloat(cost);
    if (duration !== undefined) data.duration = parseInt(duration);
    if (imageUrl !== undefined) data.imageUrl = imageUrl;

    const updatedActivity = await prisma.activity.update({
      where: { id },
      data,
    });

    return res.status(200).json({ message: 'Activity updated successfully', activity: updatedActivity });
  } catch (error) {
    console.error('Error updating activity:', error);
    return res.status(500).json({ error: 'Failed to update activity.' });
  }
};

// Delete Activity
const deleteActivity = async (req, res) => {
  try {
    const { id } = req.params;

    const activity = await prisma.activity.findUnique({
      where: { id },
      include: { stop: { include: { trip: true } } },
    });

    if (!activity) {
      return res.status(404).json({ error: 'Activity not found.' });
    }

    if (activity.stop.trip.userId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden. You do not own this trip.' });
    }

    await prisma.activity.delete({ where: { id } });

    return res.status(200).json({ message: 'Activity deleted successfully.' });
  } catch (error) {
    console.error('Error deleting activity:', error);
    return res.status(500).json({ error: 'Failed to delete activity.' });
  }
};

module.exports = {
  getActivityCatalog,
  addActivity,
  updateActivity,
  deleteActivity,
};
