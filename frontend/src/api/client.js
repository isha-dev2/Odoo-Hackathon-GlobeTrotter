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

// Rich Catalog of Indian & Global Destinations
export const MOCK_CITIES = [
  // 🇮🇳 Top Indian Destinations
  {
    id: 'city-in-1',
    name: 'Jaipur',
    country: 'India',
    state: 'Rajasthan',
    region: 'India',
    costIndex: 45.0,
    popularity: 98,
    imageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800',
    description: 'The Pink City of royalty, magnificent forts like Amber & Nahargarh, vibrant bazaars, and heritage palaces.'
  },
  {
    id: 'city-in-2',
    name: 'Goa',
    country: 'India',
    state: 'Goa',
    region: 'India',
    costIndex: 50.0,
    popularity: 99,
    imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800',
    description: 'Sun-kissed Arabian Sea beaches, Portuguese architecture, vibrant nightlife, spice plantations, and seafood.'
  },
  {
    id: 'city-in-3',
    name: 'Munnar & Alleppey',
    country: 'India',
    state: 'Kerala',
    region: 'India',
    costIndex: 40.0,
    popularity: 96,
    imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800',
    description: 'God’s Own Country with emerald rolling tea hills, tranquil backwater houseboats, and Ayurvedic wellness.'
  },
  {
    id: 'city-in-4',
    name: 'Manali & Ladakh',
    country: 'India',
    state: 'Himachal Pradesh',
    region: 'India',
    costIndex: 48.0,
    popularity: 97,
    imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800',
    description: 'Snow-capped Himalayan peaks, Rohtang pass adventures, Solang valley paragliding, and Buddhist monasteries.'
  },
  {
    id: 'city-in-5',
    name: 'Varanasi',
    country: 'India',
    state: 'Uttar Pradesh',
    region: 'India',
    costIndex: 35.0,
    popularity: 94,
    imageUrl: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800',
    description: 'The spiritual capital of India on the holy Ganges River, famous for evening Ganga Aarti, ghats, and silk.'
  },
  {
    id: 'city-in-6',
    name: 'Udaipur',
    country: 'India',
    state: 'Rajasthan',
    region: 'India',
    costIndex: 52.0,
    popularity: 95,
    imageUrl: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?w=800',
    description: 'The City of Lakes, romantic boat rides on Lake Pichola, opulent City Palace, and royal sunset views.'
  },
  {
    id: 'city-in-7',
    name: 'Mumbai',
    country: 'India',
    state: 'Maharashtra',
    region: 'India',
    costIndex: 65.0,
    popularity: 97,
    imageUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800',
    description: 'The City of Dreams, Marine Drive Queen’s Necklace, Gateway of India, Bollywood, and iconic street food.'
  },
  {
    id: 'city-in-8',
    name: 'Agra & Delhi',
    country: 'India',
    state: 'Delhi NCR',
    region: 'India',
    costIndex: 45.0,
    popularity: 99,
    imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800',
    description: 'Home of the timeless Taj Mahal, majestic Red Fort, Qutub Minar, and rich Mughal culinary culture.'
  },

  // 🌐 Top International Destinations
  {
    id: 'city-intl-1',
    name: 'Dubai',
    country: 'United Arab Emirates',
    region: 'Middle East',
    costIndex: 88.0,
    popularity: 98,
    imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800',
    description: 'Futuristic Burj Khalifa, desert dune safaris, luxury shopping malls, and Marina yacht cruises.'
  },
  {
    id: 'city-intl-2',
    name: 'Bali',
    country: 'Indonesia',
    region: 'Asia',
    costIndex: 50.0,
    popularity: 97,
    imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
    description: 'Tropical island paradise, Ubud rice terraces, cliffside Uluwatu temple dances, and surfing.'
  },
  {
    id: 'city-intl-3',
    name: 'Paris',
    country: 'France',
    region: 'Europe',
    costIndex: 85.0,
    popularity: 98,
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
    description: 'The City of Light, Eiffel Tower, Louvre museum art, Seine river cruises, and charming cafes.'
  },
  {
    id: 'city-intl-4',
    name: 'Tokyo',
    country: 'Japan',
    region: 'Asia',
    costIndex: 82.0,
    popularity: 97,
    imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
    description: 'High-tech Shibuya crossing, serene shrines, bullet trains, anime culture, and authentic ramen.'
  },
  {
    id: 'city-intl-5',
    name: 'Singapore',
    country: 'Singapore',
    region: 'Asia',
    costIndex: 85.0,
    popularity: 96,
    imageUrl: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800',
    description: 'Marina Bay Sands, Gardens by the Bay supertrees, Sentosa island, and multicultural street food.'
  },
  {
    id: 'city-intl-6',
    name: 'Rome',
    country: 'Italy',
    region: 'Europe',
    costIndex: 75.0,
    popularity: 95,
    imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800',
    description: 'Ancient Colosseum, Vatican museums, Trevi Fountain, and mouthwatering authentic Italian pasta.'
  }
];

// Rich Activities Catalog with INR & Global pricing
export const MOCK_ACTIVITIES = [
  // 🇮🇳 Indian Activities
  {
    id: 'act-in-1',
    name: 'Amber Fort Elephant / Jeep Safari & Light Show',
    city: 'Jaipur',
    country: 'India',
    category: 'Culture',
    cost: 1500,
    duration: 180,
    rating: 4.9,
    reviews: 1420,
    description: 'Guided tour of royal Sheesh Mahal mirror palace followed by evening sound & light spectacle.',
    imageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800'
  },
  {
    id: 'act-in-2',
    name: 'Chokhi Dhani Rajasthani Cultural Dinner & Folk Dance',
    city: 'Jaipur',
    country: 'India',
    category: 'Food',
    cost: 1200,
    duration: 210,
    rating: 4.8,
    reviews: 2100,
    description: 'Authentic royal Rajasthani Thali, puppet shows, camel rides, and Kalbeliya folk dance.',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800'
  },
  {
    id: 'act-in-3',
    name: 'Dudhsagar Waterfalls & Spice Plantation Jeep Safari',
    city: 'Goa',
    country: 'India',
    category: 'Adventure',
    cost: 2200,
    duration: 360,
    rating: 4.9,
    reviews: 980,
    description: 'Jungle safari to 4-tiered majestic milky waterfalls with swimming and authentic Goan spice lunch.',
    imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800'
  },
  {
    id: 'act-in-4',
    name: 'Mandovi River Sunset Catamaran Cruise & DJ Party',
    city: 'Goa',
    country: 'India',
    category: 'Nightlife',
    cost: 850,
    duration: 120,
    rating: 4.7,
    reviews: 1650,
    description: 'Scenic sunset boat cruise with live Goan folk dance performances and open deck DJ music.',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800'
  },
  {
    id: 'act-in-5',
    name: 'Alleppey Private Luxury Houseboat Cruise & Backwater Lunch',
    city: 'Munnar & Alleppey',
    country: 'India',
    category: 'Sightseeing',
    cost: 4500,
    duration: 300,
    rating: 5.0,
    reviews: 1890,
    description: 'Cruising through palm-fringed canals, paddy fields with fresh Karimeen fish fry and Kerala cuisine.',
    imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800'
  },
  {
    id: 'act-in-6',
    name: 'Munnar Tea Garden Treks & Kolukkumalai Sunrise Jeep Safari',
    city: 'Munnar & Alleppey',
    country: 'India',
    category: 'Adventure',
    cost: 1800,
    duration: 240,
    rating: 4.9,
    reviews: 840,
    description: 'World’s highest tea plantation sunrise view above floating clouds with organic tea tasting.',
    imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800'
  },
  {
    id: 'act-in-7',
    name: 'Solang Valley Paragliding & Rohtang Pass Snow Trek',
    city: 'Manali & Ladakh',
    country: 'India',
    category: 'Adventure',
    cost: 3200,
    duration: 300,
    rating: 4.9,
    reviews: 2300,
    description: 'Tandem high-altitude paragliding flight over snowy Himalayan valleys and ski slopes.',
    imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800'
  },
  {
    id: 'act-in-8',
    name: 'Taj Mahal Sunrise Guided VIP Tour & Mughal Food Walk',
    city: 'Agra & Delhi',
    country: 'India',
    category: 'Sightseeing',
    cost: 1400,
    duration: 210,
    rating: 5.0,
    reviews: 3100,
    description: 'Breathtaking sunrise marble glow at the world wonder followed by Mughlai kebab and paratha breakfast.',
    imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800'
  },

  // 🌐 International Activities
  {
    id: 'act-intl-1',
    name: 'Burj Khalifa 148th Floor At the Top VIP & Desert Safari',
    city: 'Dubai',
    country: 'United Arab Emirates',
    category: 'Sightseeing',
    cost: 6500,
    duration: 360,
    rating: 4.9,
    reviews: 2800,
    description: 'Highest observation deck view followed by red dune bashing, quad biking, and BBQ dinner.',
    imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800'
  },
  {
    id: 'act-intl-2',
    name: 'Eiffel Tower Summit Tour & Seine Dinner Cruise',
    city: 'Paris',
    country: 'France',
    category: 'Culture',
    cost: 7200,
    duration: 240,
    rating: 4.9,
    reviews: 1950,
    description: 'Fast-track summit access with panoramic views and 3-course French dinner on glass boat.',
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800'
  }
];

// Curated Initial Trips tailored for Indian & Global travelers
export const MOCK_TRIPS = [
  {
    id: 'trip-royal-rajasthan',
    name: 'Royal Rajasthan Heritage: Jaipur & Udaipur',
    description: '7-day royal escape across majestic forts, palace boat rides, vibrant bazaars, and traditional cultural dinners.',
    coverPhoto: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800',
    startDate: '2026-10-01',
    endDate: '2026-10-07',
    budgetLimit: 45000,
    isPublic: true,
    shareSlug: 'royal-rajasthan-heritage-2026',
    stops: [
      {
        id: 'stop-in-1',
        city: MOCK_CITIES[0], // Jaipur
        startDate: '2026-10-01',
        endDate: '2026-10-04',
        order: 1,
        activities: [MOCK_ACTIVITIES[0], MOCK_ACTIVITIES[1]],
      },
      {
        id: 'stop-in-2',
        city: MOCK_CITIES[5], // Udaipur
        startDate: '2026-10-04',
        endDate: '2026-10-07',
        order: 2,
        activities: [
          {
            id: 'act-ud-1',
            name: 'Lake Pichola Sunset Boat Cruise & Jag Mandir Island',
            category: 'Sightseeing',
            cost: 1100,
            duration: 120,
            description: 'Romantic royal boat ride overlooking City Palace and Lake Palace heritage.',
            imageUrl: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?w=800'
          }
        ],
      },
    ],
  },
  {
    id: 'trip-kerala-paradise',
    name: 'God’s Own Country: Kerala Backwaters & Tea Hills',
    description: '6-day serene journey through Munnar’s mist-covered tea gardens and luxury private houseboat in Alleppey.',
    coverPhoto: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800',
    startDate: '2026-11-10',
    endDate: '2026-11-16',
    budgetLimit: 38000,
    isPublic: true,
    shareSlug: 'kerala-backwaters-paradise-2026',
    stops: [
      {
        id: 'stop-in-3',
        city: MOCK_CITIES[2], // Munnar & Alleppey
        startDate: '2026-11-10',
        endDate: '2026-11-16',
        order: 1,
        activities: [MOCK_ACTIVITIES[4], MOCK_ACTIVITIES[5]],
      }
    ],
  },
  {
    id: 'trip-goa-escape',
    name: 'Goa Coastal Vibes & Beach Sunset Escape',
    description: '5-day fun-filled getaway with beach shacks, scuba diving, waterfall safari, and sunset river cruise.',
    coverPhoto: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800',
    startDate: '2026-12-20',
    endDate: '2026-12-25',
    budgetLimit: 28000,
    isPublic: true,
    shareSlug: 'goa-beach-getaway-2026',
    stops: [
      {
        id: 'stop-in-4',
        city: MOCK_CITIES[1], // Goa
        startDate: '2026-12-20',
        endDate: '2026-12-25',
        order: 1,
        activities: [MOCK_ACTIVITIES[2], MOCK_ACTIVITIES[3]],
      }
    ],
  },
  {
    id: 'trip-dubai-grand',
    name: 'Dubai & Abu Dhabi Luxury Explorer',
    description: '6-day international adventure featuring Burj Khalifa, desert dune safaris, and Ferrari World.',
    coverPhoto: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800',
    startDate: '2026-09-15',
    endDate: '2026-09-21',
    budgetLimit: 125000,
    isPublic: false,
    shareSlug: null,
    stops: [
      {
        id: 'stop-intl-1',
        city: MOCK_CITIES[8], // Dubai
        startDate: '2026-09-15',
        endDate: '2026-09-21',
        order: 1,
        activities: [MOCK_ACTIVITIES[8]],
      }
    ],
  }
];

export default api;
