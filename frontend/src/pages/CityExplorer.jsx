import React, { useState, useEffect } from 'react';
import { Search, Star, Plus, Globe, Check } from 'lucide-react';
import api from '../api/client';

const FLAG_MAP = {
  France: '🇫🇷', Japan: '🇯🇵', 'United States': '🇺🇸', Italy: '🇮🇹',
  Spain: '🇪🇸', 'United Kingdom': '🇬🇧', 'United Arab Emirates': '🇦🇪',
  Indonesia: '🇮🇩', Australia: '🇦🇺', Netherlands: '🇳🇱',
  'Czech Republic': '🇨🇿', Thailand: '🇹🇭', India: '🇮🇳',
};

function getFlag(country) {
  return FLAG_MAP[country] || '🌍';
}

function deriveExtras(city) {
  const popularity = city.popularity ?? 85;
  const costIndex = city.costIndex ?? 60;
  return {
    flag: getFlag(city.country),
    rating: (popularity / 20).toFixed(1),
    costPerDay: Math.round(costIndex * 100),
    bestTime: 'Year-round',
    tags: [
      costIndex < 55 ? 'Budget Friendly' : costIndex < 80 ? 'Mid-Range' : 'Luxury',
      popularity >= 95 ? 'Highly Popular' : 'Trending',
    ],
    desc: `Explore the landmarks, local culture, and culinary delights of ${city.name}, ${city.country}.`,
  };
}

export default function CityExplorer({ onAddCityToTrip, currencySymbol = '₹' }) {
  const [search, setSearch] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [sortBy, setSortBy] = useState('popular');
  const [citiesList, setCitiesList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addedCityId, setAddedCityId] = useState(null);

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    setLoading(true);
    try {
      const res = await api.get('/cities');
      if (res.data && res.data.cities) {
        setCitiesList(res.data.cities.map(c => ({ ...c, ...deriveExtras(c) })));
      }
    } catch (err) {
      console.error('Failed to fetch cities from backend:', err);
    } finally {
      setLoading(false);
    }
  };

  const countries = ['All', ...new Set(citiesList.map(c => c.country))];

  const filteredCities = citiesList.filter(city => {
    const matchSearch = city.name.toLowerCase().includes(search.toLowerCase()) ||
      city.country.toLowerCase().includes(search.toLowerCase());
    const matchCountry = selectedCountry === 'All' || city.country === selectedCountry;
    return matchSearch && matchCountry;
  }).sort((a, b) => {
    if (sortBy === 'popular') return (b.popularity ?? 0) - (a.popularity ?? 0);
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
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.35)', borderRadius: '99px', padding: '4px 12px', marginBottom: '10px' }}>
            <Globe size={12} color="#34d399" />
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#6ee7b7', letterSpacing: '0.05em' }}>
              LIVE DESTINATION DIRECTORY
            </span>
          </div>

          <h1 style={{ fontSize: '32px', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.5px', margin: 0 }}>
            Explore Destinations ({citiesList.length})
          </h1>

          <p style={{ fontSize: '14px', color: '#cbd5e1', marginTop: '8px', maxWidth: '600px' }}>
            Discover destinations worldwide, pulled live from your GlobeTrotter database. Add any city directly to your itinerary.
          </p>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div style={{
        background: '#ffffff', borderRadius: '20px', padding: '18px 24px',
        border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
        display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search cities or countries..."
            style={{
              width: '100%', background: '#f8fafc', border: '1.5px solid #cbd5e1',
              borderRadius: '12px', padding: '10px 14px 10px 40px',
              fontSize: '13px', fontWeight: 600, color: '#0f172a', outline: 'none'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {countries.map(c => (
            <button
              key={c}
              type="button"
              onClick={() => setSelectedCountry(c)}
              style={{
                padding: '8px 14px', borderRadius: '10px',
                fontSize: '12px', fontWeight: 800,
                background: selectedCountry === c ? 'linear-gradient(135deg, #0d9488 0%, #10b981 100%)' : '#f8fafc',
                color: selectedCountry === c ? '#ffffff' : '#475569',
                border: selectedCountry === c ? 'none' : '1px solid #cbd5e1',
                cursor: 'pointer', boxShadow: selectedCountry === c ? '0 2px 8px rgba(13,148,136,0.3)' : 'none'
              }}
            >
              {c}
            </button>
          ))}
        </div>

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

      {/* Loading state */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '48px' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#64748b' }}>Loading destinations...</div>
        </div>
      )}

      {/* Empty state */}
      {!loading && filteredCities.length === 0 && (
        <div style={{ textAlign: 'center', padding: '48px', background: 'white', borderRadius: 16, border: '1.5px dashed #e2e8f0' }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🔍</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#374151' }}>No cities found</div>
          <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>Try a different search or country</div>
        </div>
      )}

      {/* Cities Grid */}
      {!loading && filteredCities.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '22px' }}>
          {filteredCities.map(city => {
            const isAdded = addedCityId === city.id;

            return (
              <div
                key={city.id}
                style={{
                  background: '#ffffff', borderRadius: '24px',
                  border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                  overflow: 'hidden', display: 'flex', flexDirection: 'column'
                }}
              >
                <div style={{ height: '190px', position: 'relative', overflow: 'hidden', background: '#f0fdf9' }}>
                  {city.imageUrl && (
                    <img
                      src={city.imageUrl}
                      alt={city.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  )}

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
                        🔥 {city.popularity ?? 85}/100
                      </div>
                    </div>

                    <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5, margin: '10px 0 14px' }}>
                      {city.desc}
                    </p>

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
      )}
    </div>
  );
}