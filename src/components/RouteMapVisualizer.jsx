import React, { useState } from 'react';
import { MapPin, Navigation, Info, Plane, Train, Calendar, DollarSign } from 'lucide-react';

export default function RouteMapVisualizer({ cities }) {
  const [selectedCity, setSelectedCity] = useState(cities[0] || null);

  // Map coordinates normalized onto 800x480 SVG viewbox
  const getCoordinates = (city) => {
    // Basic projection scale mapping lat/lng to canvas space
    // Standard bounds approx Europe/Global view
    const minLng = -15, maxLng = 145;
    const minLat = 30, maxLat = 60;
    
    const x = ((city.lng - minLng) / (maxLng - minLng)) * 700 + 50;
    const y = 430 - ((city.lat - minLat) / (maxLat - minLat)) * 360;
    
    return { 
      x: Math.max(60, Math.min(740, x || 150)), 
      y: Math.max(50, Math.min(420, y || 200)) 
    };
  };

  return (
    <div className="map-visualizer-card glass-card">
      <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Navigation size={18} className="gradient-text" /> Multi-City Route Topology Map
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Visual travel path connecting {cities.length} destinations</p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--accent-cyan)' }}></span> City Hub
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: 14, height: 2, background: 'var(--accent-indigo)' }}></span> Transport Path
          </span>
        </div>
      </div>

      <div style={{ position: 'relative', flex: 1, overflow: 'hidden' }}>
        <svg viewBox="0 0 800 480" className="map-svg">
          <defs>
            <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="50%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#A855F7" />
            </linearGradient>

            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Grid Background Map Aesthetics */}
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
          </pattern>
          <rect width="800" height="480" fill="url(#grid)" />

          {/* World Continents Decorative Outline Paths */}
          <path
            d="M 120,160 Q 180,120 280,140 T 360,190 T 420,160 Q 520,100 680,150 Q 750,220 620,290 T 480,270 Q 320,320 220,280 Z"
            fill="rgba(255,255,255,0.015)"
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          {/* Connecting Curved Flight/Transport Paths */}
          {cities.map((city, idx) => {
            if (idx === cities.length - 1) return null;
            const start = getCoordinates(city);
            const end = getCoordinates(cities[idx + 1]);
            
            // Curved path arc control point
            const midX = (start.x + end.x) / 2;
            const midY = (start.y + end.y) / 2 - 30;

            return (
              <g key={`path-${idx}`}>
                <path
                  d={`M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`}
                  fill="none"
                  stroke="url(#routeGradient)"
                  strokeWidth="3"
                  strokeDasharray="6 4"
                  filter="url(#glow)"
                />
                
                {/* Mid-route transport badge */}
                <circle cx={midX} cy={midY} r="12" fill="#0F1424" stroke="var(--accent-indigo)" strokeWidth="1.5" />
                <text x={midX} y={midY + 4} textAnchor="middle" fill="var(--accent-cyan)" fontSize="10" fontWeight="bold">
                  ✈️
                </text>
              </g>
            );
          })}

          {/* City Destination Node Pins */}
          {cities.map((city, idx) => {
            const pos = getCoordinates(city);
            const isSelected = selectedCity?.id === city.id;

            return (
              <g 
                key={city.id} 
                transform={`translate(${pos.x}, ${pos.y})`}
                onClick={() => setSelectedCity(city)}
                style={{ cursor: 'pointer' }}
              >
                {/* Pulse Ring */}
                <circle 
                  r={isSelected ? "22" : "16"} 
                  fill={isSelected ? "rgba(56, 189, 248, 0.2)" : "rgba(99, 102, 241, 0.1)"}
                  className="pulse-circle" 
                />

                {/* Main Node Circle */}
                <circle 
                  r="12" 
                  fill={isSelected ? "var(--accent-cyan)" : "#0F1424"} 
                  stroke={isSelected ? "#FFF" : "var(--accent-indigo)"} 
                  strokeWidth="2.5"
                  filter="url(#glow)"
                />

                {/* Order Index */}
                <text 
                  y="4" 
                  textAnchor="middle" 
                  fill={isSelected ? "#000" : "var(--text-primary)"} 
                  fontSize="10" 
                  fontWeight="800"
                >
                  {idx + 1}
                </text>

                {/* City Name Label Tag */}
                <g transform="translate(0, 24)">
                  <rect 
                    x="-40" 
                    y="-12" 
                    width="80" 
                    height="20" 
                    rx="6" 
                    fill="rgba(15, 20, 36, 0.9)" 
                    stroke="rgba(255,255,255,0.1)" 
                  />
                  <text 
                    textAnchor="middle" 
                    fill="var(--text-primary)" 
                    fontSize="10" 
                    fontWeight="600"
                  >
                    {city.name}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>

        {/* Selected City Drawer / Detail Floating Card */}
        {selectedCity && (
          <div 
            className="glass-card" 
            style={{
              position: 'absolute',
              bottom: '1.25rem',
              left: '1.25rem',
              right: '1.25rem',
              padding: '1rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(15, 20, 36, 0.92)',
              border: '1px solid var(--border-active)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div 
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  background: 'var(--grad-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <MapPin size={22} color="#fff" />
              </div>
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                  {selectedCity.name}, <span style={{ color: 'var(--text-secondary)' }}>{selectedCity.country}</span>
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', gap: '1rem', marginTop: '0.2rem' }}>
                  <span><Calendar size={13} style={{ display: 'inline', marginRight: 4 }} /> {selectedCity.days} Nights Stay</span>
                  <span><DollarSign size={13} style={{ display: 'inline', marginRight: 2 }} /> ${selectedCity.days * selectedCity.costPerNight} Total Stay</span>
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {selectedCity.activities.map((act, i) => (
                <span key={i} className="activity-tag sightseeing" style={{ fontSize: '0.75rem' }}>
                  {act.title}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
