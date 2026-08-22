import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically attach JWT token from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('globetrotter_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Mock Initial Cities
export const MOCK_CITIES = [
  { id: 'city-1', name: 'Paris', country: 'France', costIndex: 85.5, popularity: 98, imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800' },
  { id: 'city-2', name: 'Tokyo', country: 'Japan', costIndex: 82.0, popularity: 97, imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800' },
  { id: 'city-3', name: 'New York', country: 'United States', costIndex: 95.0, popularity: 99, imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800' },
  { id: 'city-4', name: 'Rome', country: 'Italy', costIndex: 75.0, popularity: 94, imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800' },
  { id: 'city-5', name: 'Barcelona', country: 'Spain', costIndex: 70.0, popularity: 92, imageUrl: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800' },
  { id: 'city-6', name: 'London', country: 'United Kingdom', costIndex: 90.0, popularity: 96, imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800' },
  { id: 'city-7', name: 'Dubai', country: 'United Arab Emirates', costIndex: 88.0, popularity: 91, imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800' },
  { id: 'city-8', name: 'Bali', country: 'Indonesia', costIndex: 45.0, popularity: 95, imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800' },
];

export const MOCK_ACTIVITIES = [
  { id: 'act-1', name: 'Eiffel Tower Summit Tour', category: 'Sightseeing', cost: 45, duration: 120, description: 'Skip-the-line access to top level of Eiffel Tower with champagne toast.', imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400' },
  { id: 'act-2', name: 'Louvre Museum Masterpieces', category: 'Culture', cost: 35, duration: 180, description: 'Guided walk to Mona Lisa, Venus de Milo and ancient sculptures.', imageUrl: 'https://images.unsplash.com/photo-1565099824688-e93eb20fe622?w=400' },
  { id: 'act-3', name: 'Colosseum & Roman Forum Tour', category: 'Culture', cost: 50, duration: 180, description: 'Exclusive arena floor access with ancient ruins & gladiators history.', imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400' },
  { id: 'act-4', name: 'Trastevere Sunset Food & Wine Walk', category: 'Food', cost: 45, duration: 150, description: 'Authentic handmade pasta, gelato, and Italian wines in historic alleys.', imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400' },
  { id: 'act-5', name: 'Shibuya Sky & Ramen Tasting', category: 'Food', cost: 50, duration: 150, description: '360 degree sunset deck followed by authentic Michelin-recommended ramen.', imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400' },
];

export const MOCK_TRIPS = [
  {
    id: 'demo-trip-1',
    name: 'European Dream Vacation 2026',
    description: '14-day grand tour covering Paris and Rome with cultural tours, monuments & fine dining.',
    coverPhoto: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800',
    startDate: '2026-09-01',
    endDate: '2026-09-15',
    budgetLimit: 3500,
    isPublic: true,
    shareSlug: 'european-dream-vacation-2026-demo89',
    stops: [
      {
        id: 'stop-1',
        city: MOCK_CITIES[0],
        startDate: '2026-09-01',
        endDate: '2026-09-07',
        order: 1,
        activities: [MOCK_ACTIVITIES[0], MOCK_ACTIVITIES[1]],
      },
      {
        id: 'stop-2',
        city: MOCK_CITIES[3],
        startDate: '2026-09-08',
        endDate: '2026-09-15',
        order: 2,
        activities: [MOCK_ACTIVITIES[2], MOCK_ACTIVITIES[3]],
      },
    ],
  },
  {
    id: 'demo-trip-2',
    name: 'Tokyo & Kyoto Explorer',
    description: 'High-tech neon lights, ancient shrines, and tea ceremonies in Japan.',
    coverPhoto: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800',
    startDate: '2026-10-10',
    endDate: '2026-10-20',
    budgetLimit: 2800,
    isPublic: false,
    shareSlug: null,
    stops: [
      {
        id: 'stop-3',
        city: MOCK_CITIES[1],
        startDate: '2026-10-10',
        endDate: '2026-10-16',
        order: 1,
        activities: [MOCK_ACTIVITIES[4]],
      },
    ],
  },
];

export default api;
