import React, { useState } from 'react';
import {
  Search, Star, MapPin, Plus, Filter, Globe, DollarSign,
  TrendingUp, Sparkles, Check, ArrowRight
} from 'lucide-react';

const CITIES = [
  // 🇮🇳 Top Indian Destinations
  {
    id: 'city-in-1',
    name: 'Jaipur',
    country: 'India',
    state: 'Rajasthan',
    flag: '🇮🇳',
    region: 'India',
    costIndex: 45,
    popularity: 98,
    rating: 4.9,
    bestTime: 'Oct - Mar',
    costPerDay: 2800,
    tags: ['Royal Palaces', 'Amber Fort', 'Bazaars', 'Heritage'],
    desc: 'The Pink City of royalty, featuring Amber Fort, Hawa Mahal, City Palace, vibrant handicraft markets, and royal heritage cuisine.',
    imageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800'
  },
  {
    id: 'city-in-2',
    name: 'Goa',
    country: 'India',
    state: 'Goa',
    flag: '🇮🇳',
    region: 'India',
    costIndex: 50,
    popularity: 99,
    rating: 4.9,
    bestTime: 'Nov - Feb',
    costPerDay: 3200,
    tags: ['Beaches', 'Waterfalls', 'Nightlife', 'Seafood'],
    desc: 'Sun-drenched Arabian Sea coastline, Portuguese heritage churches, Dudhsagar waterfalls safari, beach shacks, and sunset cruises.',
    imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800'
  },
  {
    id: 'city-in-3',
    name: 'Munnar & Alleppey',
    country: 'India',
    state: 'Kerala',
    flag: '🇮🇳',
    region: 'India',
    costIndex: 40,
    popularity: 97,
    rating: 4.9,
    bestTime: 'Sep - Mar',
    costPerDay: 2500,
    tags: ['Tea Plantations', 'Houseboats', 'Ayurveda', 'Nature'],
    desc: 'God’s Own Country with rolling mist-covered tea hills in Munnar and private luxury backwater houseboats in tranquil Alleppey canals.',
    imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800'
  },
  {
    id: 'city-in-4',
    name: 'Manali & Ladakh',
    country: 'India',
    state: 'Himachal Pradesh',
    flag: '🇮🇳',
    region: 'India',
    costIndex: 48,
    popularity: 98,
    rating: 4.8,
    bestTime: 'May - Oct',
    costPerDay: 3500,
    tags: ['Snow Mountains', 'Rohtang Pass', 'Paragliding', 'Monasteries'],
    desc: 'High-altitude Himalayan wonderland with Solang Valley paragliding, Rohtang Pass snow treks, and Pangong Lake adventures.',
    imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800'
  },
  {
    id: 'city-in-5',
    name: 'Varanasi',
    country: 'India',
    state: 'Uttar Pradesh',
    flag: '🇮🇳',
    region: 'India',
    costIndex: 35,
    popularity: 95,
    rating: 4.8,
    bestTime: 'Oct - Mar',
    costPerDay: 1800,
    tags: ['Ganga Aarti', 'Spiritual Ghats', 'Silk', 'Street Food'],
    desc: 'One of the world’s oldest living cities on the holy Ganges River, renowned for mystical evening Ganga Aarti and morning boat rides.',
    imageUrl: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800'
  },
  {
    id: 'city-in-6',
    name: 'Udaipur',
    country: 'India',
    state: 'Rajasthan',
    flag: '🇮🇳',
    region: 'India',
    costIndex: 52,
    popularity: 96,
    rating: 4.9,
    bestTime: 'Oct - Mar',
    costPerDay: 3000,
    tags: ['City of Lakes', 'Lake Pichola', 'Palaces', 'Romantic'],
    desc: 'The Venice of the East with royal boat rides on Lake Pichola, towering City Palace courtyards, and romantic lakefront dining.',
    imageUrl: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?w=800'
  },
  {
    id: 'city-in-7',
    name: 'Agra & Delhi',
    country: 'India',
    state: 'Delhi NCR',
    flag: '🇮🇳',
    region: 'India',
    costIndex: 45,
    popularity: 99,
    rating: 5.0,
    bestTime: 'Oct - Mar',
    costPerDay: 2600,
    tags: ['Taj Mahal', 'Red Fort', 'Mughal Cuisine', 'History'],
    desc: 'The Golden Triangle epicenters featuring the eternal Taj Mahal, UNESCO Red Fort, Chandni Chowk street food, and Qutub Minar.',
    imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800'
  },

  // 🌐 Top International Destinations
  {
    id: 'city-intl-1',
    name: 'Dubai',
    country: 'United Arab Emirates',
    flag: '🇦🇪',
    region: 'Middle East',
    costIndex: 88,
    popularity: 98,
    rating: 4.9,
    bestTime: 'Nov - Apr',
    costPerDay: 9500,
    tags: ['Burj Khalifa', 'Desert Safari', 'Luxury', 'Shopping'],
    desc: 'Futuristic skyscrapers, desert dune bashing, luxury mega-malls, Marina yacht cruises, and theme parks.',
    imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800'
  },
  {
    id: 'city-intl-2',
    name: 'Bali',
    country: 'Indonesia',
    flag: '🇮🇩',
    region: 'Asia',
    costIndex: 50,
    popularity: 97,
    rating: 4.8,
    bestTime: 'Apr - Oct',
    costPerDay: 4200,
    tags: ['Tropical Beaches', 'Ubud Swings', 'Temples', 'Surfing'],
    desc: 'Island of the Gods featuring lush terraced rice fields, sacred cliffside temples, and vibrant coastal culture.',
    imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800'
  },
  {
    id: 'city-intl-3',
    name: 'Paris',
    country: 'France',
    flag: '🇫🇷',
    region: 'Europe',
    costIndex: 85,
    popularity: 98,
    rating: 4.9,
    bestTime: 'May - Sep',
    costPerDay: 14000,
    tags: ['Art & Culture', 'Eiffel Tower', 'Fine Dining', 'Romance'],
    desc: 'The iconic City of Light with the Louvre Museum, Eiffel Tower, Seine river dinner cruises, and Parisian cafes.',
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800'
  },
  {
    id: 'city-intl-4',
    name: 'Tokyo',
    country: 'Japan',
    flag: '🇯🇵',
    region: 'Asia',
    costIndex: 82,
    popularity: 99,
    rating: 4.9,
    bestTime: 'Mar - May',
    costPerDay: 11500,
    tags: ['High Tech', 'Shibuya', 'Shrines', 'Michelin Ramen'],
    desc: 'An electrifying metropolis blending futuristic neon skyscrapers, serene Shinto shrines, and authentic culinary masters.',
    imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800'
  }
];

const REGIONS = ['All', 'India', 'Europe', 'Asia', 'Middle East'];

export default function CityExplorer({ onAddCityToTrip, currencySymbol = '₹' }) {
  const [search, setSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [sortBy, setSortBy] = useState('popular');
  const [addedCityId, setAddedCityId] = useState(null);

  const filteredCities = CITIES.filter(city => {
    const matchSearch = city.name.toLowerCase().includes(search.toLowerCase()) ||
      city.country.toLowerCase().includes(search.toLowerCase()) ||
      city.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchRegion = selectedRegion === 'All' || city.region === selectedRegion;
    return matchSearch && matchRegion;
  }).sort((a, b) => {
    if (sortBy === 'popular') return b.popularity - a.popularity;
    if (sortBy === 'cost-asc') return a.costPerDay - b.costPerDay;
    if (sortBy === 'cost-desc') return b.costPerDay - a.costPerDay;
    return b.rating - a.rating;
  });

  const handleAdd = (city) => {
    onAddCityToTrip(city);
    setAddedCityId(city.id);
    setTimeout(() => setAddedCityId(null), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #042f2e 0%, #064e3b 40%, #0f172a 100%)',
        borderRadius: '24px', padding: '36px 40px',
        position: 'relative', overflow: 'hidden',
        boxShadow: '0 12px 36px -8px rgba(4, 47, 46, 0.4)',
        border: '1px solid rgba(16, 185, 129, 0.2)'
      }}>
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.35)', borderRadius: '99px', padding: '4px 12px', marginBottom: '10px' }}>
              <Globe size={12} color="#34d399" />
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#6ee7b7', letterSpacing: '0.05em' }}>
                INDIAN & GLOBAL DESTINATION DIRECTORY
              </span>
            </div>

            <h1 style={{ fontSize: '32px', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.5px', margin: 0 }}>
              Explore Destinations ({CITIES.length})
            </h1>

            <p style={{ fontSize: '14px', color: '#cbd5e1', marginTop: '8px', maxWidth: '600px' }}>
              Discover incredible royal forts in Rajasthan, Kerala backwaters, Goa beaches, or global destinations. Add them directly to your multi-city itinerary.
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div style={{
        background: '#ffffff', borderRadius: '20px', padding: '18px 24px',
        border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
        display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between'
      }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search Jaipur, Goa, Kerala, Dubai, Paris..."
            style={{
              width: '100%', background: '#f8fafc', border: '1.5px solid #cbd5e1',
              borderRadius: '12px', padding: '10px 14px 10px 40px',
              fontSize: '13px', fontWeight: 600, color: '#0f172a', outline: 'none'
            }}
          />
        </div>

        {/* Region Pills */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {REGIONS.map(r => (
            <button
              key={r}
              type="button"
              onClick={() => setSelectedRegion(r)}
              style={{
                padding: '8px 14px', borderRadius: '10px',
                fontSize: '12px', fontWeight: 800,
                background: selectedRegion === r ? 'linear-gradient(135deg, #0d9488 0%, #10b981 100%)' : '#f8fafc',
                color: selectedRegion === r ? '#ffffff' : '#475569',
                border: selectedRegion === r ? 'none' : '1px solid #cbd5e1',
                cursor: 'pointer', boxShadow: selectedRegion === r ? '0 2px 8px rgba(13,148,136,0.3)' : 'none'
              }}
            >
              {r === 'India' ? '🇮🇳 India' : r}
            </button>
          ))}
        </div>

        {/* Sort dropdown */}
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          style={{
            background: '#f8fafc', border: '1.5px solid #cbd5e1',
            borderRadius: '10px', padding: '8px 12px', fontSize: '12px',
            fontWeight: 700, color: '#334155', outline: 'none', cursor: 'pointer'
          }}
        >
          <option value="popular">🔥 Most Popular</option>
          <option value="rating">⭐ Highest Rated</option>
          <option value="cost-asc">💰 Budget Friendly First</option>
          <option value="cost-desc">💎 Luxury First</option>
        </select>
      </div>

      {/* Cities Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '22px' }}>
        {filteredCities.map(city => {
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
              {/* Image thumbnail */}
              <div style={{ height: '190px', position: 'relative', overflow: 'hidden' }}>
                <img
                  src={city.imageUrl}
                  alt={city.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />

                <div style={{
                  position: 'absolute', top: '14px', left: '14px',
                  background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(8px)',
                  color: '#ffffff', borderRadius: '99px', padding: '4px 12px',
                  fontSize: '12px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '5px'
                }}>
                  <span>{city.flag}</span>
                  <span>{city.country}</span>
                </div>

                <div style={{
                  position: 'absolute', top: '14px', right: '14px',
                  background: 'rgba(245, 158, 11, 0.9)', backdropFilter: 'blur(8px)',
                  color: '#ffffff', borderRadius: '99px', padding: '4px 10px',
                  fontSize: '11px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px'
                }}>
                  <Star size={12} fill="#ffffff" />
                  <span>{city.rating}</span>
                </div>

                <div style={{
                  position: 'absolute', bottom: '14px', right: '14px',
                  background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(8px)',
                  color: '#34d399', borderRadius: '10px', padding: '4px 10px',
                  fontSize: '12px', fontWeight: 800
                }}>
                  ~{currencySymbol}{city.costPerDay.toLocaleString()} / day
                </div>
              </div>

              {/* Body */}
              <div style={{ padding: '22px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                        {city.name}
                      </h3>
                      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px', fontWeight: 600 }}>
                        Best Season: <strong style={{ color: '#0d9488' }}>{city.bestTime}</strong>
                      </div>
                    </div>

                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#0d9488', background: '#f0fdf9', padding: '3px 8px', borderRadius: '8px', border: '1px solid #a7f3d0' }}>
                      🔥 {city.popularity}/100
                    </div>
                  </div>

                  <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5, margin: '10px 0 14px' }}>
                    {city.desc}
                  </p>

                  {/* Tags */}
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '18px' }}>
                    {city.tags.map((t, idx) => (
                      <span key={idx} style={{ fontSize: '11px', fontWeight: 700, color: '#334155', background: '#f1f5f9', borderRadius: '6px', padding: '2px 8px' }}>
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleAdd(city)}
                  style={{
                    width: '100%', padding: '12px', borderRadius: '14px',
                    background: isAdded ? '#10b981' : 'linear-gradient(135deg, #0d9488 0%, #10b981 100%)',
                    color: '#ffffff', border: 'none',
                    fontSize: '13px', fontWeight: 800, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    boxShadow: '0 4px 14px rgba(13,148,136,0.3)'
                  }}
                >
                  {isAdded ? (
                    <>
                      <Check size={16} strokeWidth={3} />
                      <span>Added to Trip Itinerary!</span>
                    </>
                  ) : (
                    <>
                      <Plus size={16} strokeWidth={2.5} />
                      <span>Add Destination to Itinerary</span>
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
