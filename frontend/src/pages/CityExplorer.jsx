import React, { useState } from 'react';
import {
  Search, Star, MapPin, Plus, Filter, Globe, DollarSign,
  TrendingUp, Sparkles, Check, ArrowRight
} from 'lucide-react';

const CITIES = [
  {
    id: 'city-1',
    name: 'Paris',
    country: 'France',
    flag: '🇫🇷',
    region: 'Europe',
    costIndex: 85,
    popularity: 98,
    rating: 4.9,
    bestTime: 'May - Sep',
    costPerDay: 160,
    tags: ['Art & Culture', 'Fine Dining', 'Romance'],
    desc: 'The iconic City of Light, home to the Louvre, Eiffel Tower, world-class gastronomy, and charming Parisian boulevards.',
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800'
  },
  {
    id: 'city-2',
    name: 'Tokyo',
    country: 'Japan',
    flag: '🇯🇵',
    region: 'Asia',
    costIndex: 82,
    popularity: 99,
    rating: 4.9,
    bestTime: 'Mar - May',
    costPerDay: 120,
    tags: ['High Tech', 'Temples', 'Street Food'],
    desc: 'An electrifying metropolis blending futuristic neon skyscrapers, serene Shinto shrines, Michelin dining, and anime culture.',
    imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800'
  },
  {
    id: 'city-3',
    name: 'Rome',
    country: 'Italy',
    flag: '🇮🇹',
    region: 'Europe',
    costIndex: 75,
    popularity: 96,
    rating: 4.8,
    bestTime: 'Apr - Jun',
    costPerDay: 130,
    tags: ['Ancient History', 'Gelato', 'Architecture'],
    desc: 'The Eternal City with the Colosseum, Roman Forum, Vatican City, historic piazzas, and mouthwatering pasta.',
    imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800'
  },
  {
    id: 'city-4',
    name: 'Barcelona',
    country: 'Spain',
    flag: '🇪🇸',
    region: 'Europe',
    costIndex: 70,
    popularity: 94,
    rating: 4.8,
    bestTime: 'May - Oct',
    costPerDay: 110,
    tags: ['Gaudí Art', 'Tapas', 'Mediterranean Beach'],
    desc: 'Vibrant coastal capital boasting Gaudí’s Sagrada Família, Park Güell, sunny beaches, and bustling Gothic Quarter.',
    imageUrl: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800'
  },
  {
    id: 'city-5',
    name: 'Bali (Ubud & Seminyak)',
    country: 'Indonesia',
    flag: '🇮🇩',
    region: 'Asia',
    costIndex: 45,
    popularity: 97,
    rating: 4.8,
    bestTime: 'Apr - Oct',
    costPerDay: 55,
    tags: ['Beaches', 'Yoga Retreats', 'Waterfalls'],
    desc: 'Tropical Indonesian paradise of lush green rice terraces, sacred monkey forests, beach clubs, and serene wellness retreats.',
    imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800'
  },
  {
    id: 'city-6',
    name: 'New York City',
    country: 'United States',
    flag: '🇺🇸',
    region: 'Americas',
    costIndex: 95,
    popularity: 98,
    rating: 4.8,
    bestTime: 'Sep - Nov',
    costPerDay: 220,
    tags: ['Broadway', 'Skyline', 'Shopping'],
    desc: 'The city that never sleeps — featuring Times Square, Central Park, Statue of Liberty, world-famous museums, and skyline views.',
    imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800'
  },
  {
    id: 'city-7',
    name: 'Dubai',
    country: 'United Arab Emirates',
    flag: '🇦🇪',
    region: 'Middle East',
    costIndex: 88,
    popularity: 93,
    rating: 4.7,
    bestTime: 'Nov - Mar',
    costPerDay: 180,
    tags: ['Luxury Resorts', 'Desert Safari', 'Burj Khalifa'],
    desc: 'Ultra-modern oasis featuring Burj Khalifa, luxury shopping malls, desert dune bashing, and Palm Jumeirah.',
    imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800'
  },
  {
    id: 'city-8',
    name: 'London',
    country: 'United Kingdom',
    flag: '🇬🇧',
    region: 'Europe',
    costIndex: 90,
    popularity: 97,
    rating: 4.8,
    bestTime: 'Jun - Aug',
    costPerDay: 175,
    tags: ['Royal Palaces', 'West End', 'Historic Pubs'],
    desc: 'Historic powerhouse featuring Big Ben, Tower Bridge, Buckingham Palace, West End theatre shows, and picturesque parks.',
    imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800'
  },
  {
    id: 'city-9',
    name: 'Santorini',
    country: 'Greece',
    flag: '🇬🇷',
    region: 'Europe',
    costIndex: 86,
    popularity: 95,
    rating: 4.9,
    bestTime: 'May - Oct',
    costPerDay: 150,
    tags: ['Caldera Sunsets', 'White Villages', 'Wine'],
    desc: 'Spectacular Cycladic island renowned for cliffside whitewashed villas, blue-domed churches, and world-famous sunsets in Oia.',
    imageUrl: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800'
  }
];

const REGIONS = ['All', 'Europe', 'Asia', 'Americas', 'Middle East'];

export default function CityExplorer({ onAddCityToTrip, currencySymbol = '$' }) {
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('All');
  const [sortBy, setSortBy] = useState('popularity');
  const [addedCityId, setAddedCityId] = useState(null);

  const filtered = CITIES.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.country.toLowerCase().includes(search.toLowerCase()) ||
      c.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchRegion = region === 'All' || c.region === region;
    return matchSearch && matchRegion;
  }).sort((a, b) => {
    if (sortBy === 'popularity') return b.popularity - a.popularity;
    if (sortBy === 'costAsc') return a.costPerDay - b.costPerDay;
    if (sortBy === 'costDesc') return b.costPerDay - a.costPerDay;
    return a.name.localeCompare(b.name);
  });

  const handleAdd = (city) => {
    onAddCityToTrip(city);
    setAddedCityId(city.id);
    setTimeout(() => setAddedCityId(null), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #042f2e 0%, #064e3b 40%, #0f172a 100%)',
        borderRadius: '24px', padding: '36px 40px',
        position: 'relative', overflow: 'hidden',
        boxShadow: '0 12px 36px -8px rgba(4, 47, 46, 0.4)',
        border: '1px solid rgba(16, 185, 129, 0.2)'
      }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.35)', borderRadius: '99px', padding: '4px 12px', marginBottom: '10px' }}>
            <Globe size={12} color="#34d399" />
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#6ee7b7', letterSpacing: '0.05em' }}>
              GLOBAL DESTINATIONS CATALOG
            </span>
          </div>

          <h1 style={{ fontSize: '32px', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.5px', margin: 0 }}>
            Discover & Add Cities to Your Trip
          </h1>

          <p style={{ fontSize: '14px', color: '#cbd5e1', marginTop: '8px', maxWidth: '600px' }}>
            Explore handpicked cities worldwide with cost indexes, season recommendations, and top highlights.
          </p>
        </div>
      </div>

      {/* Search & Filtering Controls */}
      <div style={{
        background: '#ffffff', borderRadius: '20px', padding: '18px 24px',
        border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
        display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between'
      }}>
        {/* Search Input */}
        <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
          <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by city, country, or tags (e.g. Paris, Japan, Beaches, Art)..."
            style={{
              width: '100%', background: '#f8fafc', border: '1.5px solid #cbd5e1',
              borderRadius: '12px', padding: '10px 14px 10px 40px',
              fontSize: '13px', fontWeight: 600, color: '#0f172a', outline: 'none'
            }}
          />
        </div>

        {/* Region Filter Pills */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {REGIONS.map(r => (
            <button
              key={r}
              onClick={() => setRegion(r)}
              style={{
                padding: '8px 14px', borderRadius: '10px',
                fontSize: '12px', fontWeight: 800,
                background: region === r ? 'linear-gradient(135deg, #0d9488 0%, #10b981 100%)' : '#f8fafc',
                color: region === r ? '#ffffff' : '#475569',
                border: region === r ? 'none' : '1px solid #cbd5e1',
                cursor: 'pointer', boxShadow: region === r ? '0 2px 8px rgba(13,148,136,0.3)' : 'none'
              }}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Sort dropdown */}
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          style={{
            padding: '8px 14px', borderRadius: '10px',
            background: '#ffffff', border: '1.5px solid #cbd5e1',
            fontSize: '12px', fontWeight: 700, color: '#0f172a', outline: 'none', cursor: 'pointer'
          }}
        >
          <option value="popularity">Sort: Most Popular</option>
          <option value="costAsc">Sort: Budget-Friendly first</option>
          <option value="costDesc">Sort: Luxury first</option>
          <option value="name">Sort: Alphabetical</option>
        </select>
      </div>

      {/* Cities Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {filtered.map(city => {
          const isAdded = addedCityId === city.id;

          return (
            <div
              key={city.id}
              style={{
                background: '#ffffff', borderRadius: '24px',
                border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                overflow: 'hidden', display: 'flex', flexDirection: 'column',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}
            >
              {/* City Photo Banner */}
              <div style={{ height: '180px', position: 'relative', overflow: 'hidden' }}>
                <img
                  src={city.imageUrl}
                  alt={city.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                
                {/* Country Tag */}
                <div style={{
                  position: 'absolute', top: '14px', left: '14px',
                  background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(8px)',
                  color: '#ffffff', borderRadius: '99px', padding: '4px 12px',
                  fontSize: '12px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px'
                }}>
                  <span>{city.flag}</span>
                  <span>{city.country}</span>
                </div>

                {/* Rating Badge */}
                <div style={{
                  position: 'absolute', top: '14px', right: '14px',
                  background: '#ffffff', color: '#0f172a',
                  borderRadius: '99px', padding: '4px 10px',
                  fontSize: '12px', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '4px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                }}>
                  <Star size={13} color="#f59e0b" fill="#f59e0b" />
                  <span>{city.rating}</span>
                </div>
              </div>

              {/* Card Body */}
              <div style={{ padding: '22px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a', margin: '0 0 6px' }}>
                    {city.name}
                  </h3>

                  <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5, margin: '0 0 14px' }}>
                    {city.desc}
                  </p>

                  {/* Highlights metadata */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '14px', background: '#f8fafc', padding: '10px 14px', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>
                      Daily Estimate: <strong style={{ color: '#0d9488', fontWeight: 800 }}>{currencySymbol}{city.costPerDay}</strong>
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>
                      Best Season: <strong style={{ color: '#0f172a', fontWeight: 700 }}>{city.bestTime}</strong>
                    </div>
                  </div>

                  {/* Category Tags */}
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
                    {city.tags.map(t => (
                      <span
                        key={t}
                        style={{
                          fontSize: '10px', fontWeight: 800, color: '#0f766e',
                          background: '#f0fdf9', border: '1px solid #a7f3d0',
                          borderRadius: '99px', padding: '3px 8px'
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleAdd(city)}
                  style={{
                    width: '100%', padding: '12px', borderRadius: '14px',
                    background: isAdded ? '#10b981' : 'linear-gradient(135deg, #0d9488 0%, #10b981 100%)',
                    color: '#ffffff', border: 'none',
                    fontSize: '13px', fontWeight: 800, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    boxShadow: '0 4px 14px rgba(13,148,136,0.3)', transition: 'all 0.15s ease'
                  }}
                >
                  {isAdded ? (
                    <>
                      <Check size={16} strokeWidth={3} />
                      <span>Added to Itinerary!</span>
                    </>
                  ) : (
                    <>
                      <Plus size={16} strokeWidth={2.5} />
                      <span>Add to Trip Itinerary</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
