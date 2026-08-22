import React, { useState } from 'react';
import { Search, Star, MapPin, Plus, Filter, Globe } from 'lucide-react';

const CITIES = [
  { name: 'Tokyo', country: 'Japan', emoji: '🇯🇵', region: 'Asia', rating: 4.9, tags: ['Culture', 'Food', 'Technology'], desc: 'A perfect blend of ancient temples and ultramodern skyscrapers.' },
  { name: 'Paris', country: 'France', emoji: '🇫🇷', region: 'Europe', rating: 4.8, tags: ['Romance', 'Art', 'Food'], desc: 'The city of lights, love, and world-class cuisine.' },
  { name: 'Bali', country: 'Indonesia', emoji: '🇮🇩', region: 'Asia', rating: 4.7, tags: ['Beach', 'Spiritual', 'Nature'], desc: 'Tropical paradise with rice terraces and sacred temples.' },
  { name: 'New York', country: 'USA', emoji: '🇺🇸', region: 'America', rating: 4.8, tags: ['Urban', 'Art', 'Shopping'], desc: 'The city that never sleeps — iconic skyline and energy.' },
  { name: 'Santorini', country: 'Greece', emoji: '🇬🇷', region: 'Europe', rating: 4.9, tags: ['Beach', 'Romance', 'Views'], desc: 'Stunning caldera views with whitewashed buildings.' },
  { name: 'Dubai', country: 'UAE', emoji: '🇦🇪', region: 'Middle East', rating: 4.7, tags: ['Luxury', 'Shopping', 'Architecture'], desc: 'Futuristic skyline meets desert adventure and luxury.' },
  { name: 'Barcelona', country: 'Spain', emoji: '🇪🇸', region: 'Europe', rating: 4.8, tags: ['Architecture', 'Beach', 'Food'], desc: 'Gaudí masterpieces and vibrant tapas culture.' },
  { name: 'Kyoto', country: 'Japan', emoji: '🇯🇵', region: 'Asia', rating: 4.9, tags: ['Culture', 'Nature', 'Historical'], desc: 'Ancient capital with 1600 Buddhist temples.' },
  { name: 'Maldives', country: 'Maldives', emoji: '🇲🇻', region: 'Asia', rating: 5.0, tags: ['Beach', 'Luxury', 'Diving'], desc: 'Crystal-clear waters and overwater bungalows.' },
  { name: 'Rio de Janeiro', country: 'Brazil', emoji: '🇧🇷', region: 'America', rating: 4.6, tags: ['Beach', 'Culture', 'Adventure'], desc: 'Christ the Redeemer, Copacabana, and vibrant carnival spirit.' },
  { name: 'Cape Town', country: 'South Africa', emoji: '🇿🇦', region: 'Africa', rating: 4.7, tags: ['Nature', 'Adventure', 'Wine'], desc: 'Table Mountain views with stunning coastline.' },
  { name: 'Sydney', country: 'Australia', emoji: '🇦🇺', region: 'Oceania', rating: 4.8, tags: ['Beach', 'Urban', 'Nature'], desc: 'Iconic Opera House and golden beaches.' },
];

const REGIONS = ['All', 'Asia', 'Europe', 'America', 'Middle East', 'Africa', 'Oceania'];

export default function CityExplorer({ onAddCityToTrip }) {
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('All');

  const filtered = CITIES.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.country.toLowerCase().includes(search.toLowerCase()) ||
      c.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchRegion = region === 'All' || c.region === region;
    return matchSearch && matchRegion;
  });

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
          Discover {CITIES.length}+ destinations worldwide · Click any city to add to your trip
        </p>
      </div>

      {/* Search + Region Filter */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search cities, countries, or tags..."
            style={{
              width: '100%', background: 'white', border: '1.5px solid #e2e8f0',
              borderRadius: 10, padding: '9px 12px 9px 34px',
              fontSize: 13, color: '#0f172a', outline: 'none', fontFamily: 'Inter, sans-serif'
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {REGIONS.map(r => (
            <button key={r} onClick={() => setRegion(r)} style={{
              padding: '7px 14px', borderRadius: 99, fontSize: 11, fontWeight: 700,
              background: region === r ? 'linear-gradient(135deg, #0d9488, #10b981)' : 'white',
              color: region === r ? 'white' : '#64748b',
              border: region === r ? 'none' : '1.5px solid #e2e8f0',
              cursor: 'pointer',
              boxShadow: region === r ? '0 2px 8px rgba(13,148,136,0.25)' : 'none'
            }}>{r}</button>
          ))}
        </div>
      </div>

      {/* City Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
        {filtered.map(city => (
          <div key={city.name} style={{
            background: 'white', borderRadius: 18, border: '1.5px solid #f1f5f9',
            overflow: 'hidden', transition: 'all 0.2s',
            boxShadow: '0 2px 10px rgba(0,0,0,0.04)'
          }}>
            {/* Card top */}
            <div style={{
              background: 'linear-gradient(135deg, #f0fdf9, #e0f2fe)',
              padding: '20px 18px', textAlign: 'center'
            }}>
              <div style={{ fontSize: 40 }}>{city.emoji}</div>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', marginTop: 8 }}>{city.name}</div>
              <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600, marginTop: 2 }}>{city.country}</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: 6 }}>
                <Star size={11} color="#f59e0b" fill="#f59e0b" />
                <span style={{ fontSize: 11, fontWeight: 800, color: '#0f172a' }}>{city.rating}</span>
              </div>
            </div>

            <div style={{ padding: '14px 16px' }}>
              <p style={{ fontSize: 11, color: '#64748b', lineHeight: 1.6, margin: '0 0 10px' }}>{city.desc}</p>

              {/* Tags */}
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 12 }}>
                {city.tags.map(tag => (
                  <span key={tag} style={{
                    fontSize: 9, fontWeight: 700, color: '#0f766e',
                    background: '#f0fdf9', border: '1px solid #99f6e4',
                    borderRadius: 99, padding: '2px 8px'
                  }}>
                    {tag}
                  </span>
                ))}
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
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '48px', background: 'white', borderRadius: 16, border: '1.5px dashed #e2e8f0' }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🔍</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#374151' }}>No cities found</div>
          <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>Try a different search or region</div>
        </div>
      )}
    </div>
  );
}
