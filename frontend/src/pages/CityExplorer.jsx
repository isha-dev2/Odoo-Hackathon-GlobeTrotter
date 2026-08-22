import React, { useState, useEffect } from 'react';
import { Search, Star, MapPin, Plus, Globe } from 'lucide-react';
import api from '../api/client';

const COUNTRIES = ['All', 'France', 'Japan', 'Italy', 'Spain', 'United States', 'United Kingdom', 'United Arab Emirates', 'Indonesia', 'Australia', 'Netherlands'];

export default function CityExplorer({ onAddCityToTrip }) {
  const [search, setSearch] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [citiesList, setCitiesList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCities();
  }, [search, selectedCountry]);

  const fetchCities = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search.trim()) params.q = search.trim();
      if (selectedCountry !== 'All') params.country = selectedCountry;
      const res = await api.get('/cities', { params });
      if (res.data && res.data.cities) {
        setCitiesList(res.data.cities);
      }
    } catch (err) {
      console.error('Failed to fetch cities from backend:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a, #134e4a)',
        borderRadius: 20, padding: '24px 28px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <Globe size={20} color="#34d399" />
          <h1 style={{ fontSize: 22, fontWeight: 900, color: 'white', margin: 0, letterSpacing: '-0.5px' }}>Explore Cities</h1>
        </div>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', margin: 0 }}>
          Discover destinations worldwide · Click any city to add to your trip
        </p>
      </div>

      {/* Search + Region Filter */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search cities or countries..."
            style={{
              width: '100%', background: 'white', border: '1.5px solid #e2e8f0',
              borderRadius: 10, padding: '9px 12px 9px 34px',
              fontSize: 13, color: '#0f172a', outline: 'none', fontFamily: 'Inter, sans-serif'
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {COUNTRIES.map(c => (
            <button key={c} onClick={() => setSelectedCountry(c)} style={{
              padding: '7px 14px', borderRadius: 99, fontSize: 11, fontWeight: 700,
              background: selectedCountry === c ? 'linear-gradient(135deg, #0d9488, #10b981)' : 'white',
              color: selectedCountry === c ? 'white' : '#64748b',
              border: selectedCountry === c ? 'none' : '1.5px solid #e2e8f0',
              cursor: 'pointer',
              boxShadow: selectedCountry === c ? '0 2px 8px rgba(13,148,136,0.25)' : 'none'
            }}>{c}</button>
          ))}
        </div>
      </div>

      {/* City Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '48px' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#64748b' }}>Loading destinations...</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
          {citiesList.map(city => {
            const popularityRating = city.popularity ? (city.popularity / 20).toFixed(1) : '4.5';
            const costTag = city.costIndex ? `Cost Index: ${city.costIndex}` : 'Budget Friendly';
            const popularTag = city.popularity ? `Popularity: ${city.popularity}%` : 'Recommended';
            return (
              <div key={city.id} style={{
                background: 'white', borderRadius: 18, border: '1.5px solid #f1f5f9',
                overflow: 'hidden', transition: 'all 0.2s',
                boxShadow: '0 2px 10px rgba(0,0,0,0.04)'
              }}>
                {/* Card top */}
                <div style={{
                  background: 'linear-gradient(135deg, #f0fdf9, #e0f2fe)',
                  padding: '20px 18px', textAlign: 'center'
                }}>
                  <div style={{ fontSize: 40 }}>🏙️</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', marginTop: 8 }}>{city.name}</div>
                  <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600, marginTop: 2 }}>{city.country}</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: 6 }}>
                    <Star size={11} color="#f59e0b" fill="#f59e0b" />
                    <span style={{ fontSize: 11, fontWeight: 800, color: '#0f172a' }}>{popularityRating}</span>
                  </div>
                </div>

                <div style={{ padding: '14px 16px' }}>
                  <p style={{ fontSize: 11, color: '#64748b', lineHeight: 1.6, margin: '0 0 10px' }}>
                    Explore the beautiful landmarks, local experiences, and culinary delights in {city.name}.
                  </p>

                  {/* Tags */}
                  <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 12 }}>
                    <span style={{
                      fontSize: 9, fontWeight: 700, color: '#0f766e',
                      background: '#f0fdf9', border: '1px solid #99f6e4',
                      borderRadius: 99, padding: '2px 8px'
                    }}>
                      {costTag}
                    </span>
                    <span style={{
                      fontSize: 9, fontWeight: 700, color: '#1e3a8a',
                      background: '#eff6ff', border: '1px solid #bfdbfe',
                      borderRadius: 99, padding: '2px 8px'
                    }}>
                      {popularTag}
                    </span>
                  </div>

                  <button
                    onClick={() => onAddCityToTrip(city)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      background: 'linear-gradient(135deg, #0d9488, #10b981)',
                      color: 'white', border: 'none', borderRadius: 10,
                      padding: '9px', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(13,148,136,0.25)'
                    }}
                  >
                    <Plus size={13} /> Add to Trip
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && citiesList.length === 0 && (
        <div style={{ textAlign: 'center', padding: '48px', background: 'white', borderRadius: 16, border: '1.5px dashed #e2e8f0' }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🔍</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#374151' }}>No cities found</div>
          <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>Try a different search or region</div>
        </div>
      )}
    </div>
  );
}
