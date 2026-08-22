import React, { useState } from 'react';
import {
  MapPin, Navigation, Compass, Plane, Train, Sun, CloudRain,
  Wind, Sparkles, Download, Info, CheckCircle2, DollarSign
} from 'lucide-react';
import { MOCK_CITIES } from '../api/client';

export default function InteractiveMapView({ currentTrip, onSelectCity, currencySymbol = '$' }) {
  const stops = (currentTrip && currentTrip.stops && currentTrip.stops.length > 0)
    ? currentTrip.stops
    : [
        { id: 's1', city: MOCK_CITIES[0], startDate: '2026-09-01', endDate: '2026-09-07', order: 1 },
        { id: 's2', city: MOCK_CITIES[3], startDate: '2026-09-08', endDate: '2026-09-15', order: 2 },
      ];

  // Dynamic coordinates generator based on number of stops
  const basePositions = [
    { x: 22, y: 38 },
    { x: 48, y: 62 },
    { x: 72, y: 44 },
    { x: 88, y: 32 },
  ];

  const cityCoordinates = stops.map((stop, i) => {
    const pos = basePositions[i % basePositions.length];
    const cityObj = stop.city?.name ? stop.city : (MOCK_CITIES.find(c => c.name === stop.city) || MOCK_CITIES[0]);
    return {
      x: pos.x,
      y: pos.y,
      city: cityObj,
      order: i + 1,
      activitiesCount: stop.activities?.length || 0,
      distance: i === 0 ? 'Departure Point' : `${850 + i * 250} km • Flight Path`
    };
  });

  const [selectedPin, setSelectedPin] = useState(cityCoordinates[0] || null);
  const activePin = selectedPin || cityCoordinates[0];

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
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.35)', borderRadius: '99px', padding: '4px 12px', marginBottom: '10px' }}>
              <Compass size={12} color="#34d399" />
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#6ee7b7', letterSpacing: '0.05em' }}>
                ROUTE TOPOLOGY & FLIGHT CONNECTOR
              </span>
            </div>

            <h1 style={{ fontSize: '32px', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.5px', margin: 0 }}>
              {currentTrip?.name || 'World Route'} — Topology Map
            </h1>

            <p style={{ fontSize: '14px', color: '#cbd5e1', marginTop: '8px' }}>
              Connected route across {stops.length} destinations with geographic distance and weather estimates.
            </p>
          </div>

          <button
            onClick={() => alert('Map route exported successfully as PNG topology vector!')}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)',
              color: '#ffffff', borderRadius: '12px', padding: '10px 18px',
              fontSize: '13px', fontWeight: 800, cursor: 'pointer'
            }}
          >
            <Download size={15} />
            <span>Export Map Vector</span>
          </button>
        </div>
      </div>

      {/* Main Map & Stop Spec Split Screen */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        
        {/* Visual Map Canvas Card */}
        <div style={{
          gridColumn: 'span 2',
          background: '#ffffff', borderRadius: '24px', padding: '28px',
          border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
          position: 'relative', overflow: 'hidden', minHeight: '440px',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
        }}>
          {/* Header Bar inside canvas */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f0fdf9', padding: '6px 14px', borderRadius: '12px', border: '1px solid #a7f3d0' }}>
              <Navigation size={14} color="#0d9488" />
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#0f766e' }}>
                Route Topology ({stops.length} Cities)
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f8fafc', padding: '6px 12px', borderRadius: '10px', fontSize: '11px', fontWeight: 700, color: '#475569' }}>
              <Plane size={13} color="#0d9488" />
              <span>Direct Flight Connections</span>
            </div>
          </div>

          {/* SVG Canvas with Flight Path */}
          <div style={{ position: 'relative', width: '100%', height: '240px', margin: '20px 0' }}>
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0d9488" />
                  <stop offset="50%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
              </defs>
              {cityCoordinates.length > 1 && (
                <path
                  d={`M ${cityCoordinates[0].x} ${cityCoordinates[0].y} ` + cityCoordinates.slice(1).map(c => `L ${c.x} ${c.y}`).join(' ')}
                  fill="none"
                  stroke="url(#routeGradient)"
                  strokeWidth="2.5"
                  strokeDasharray="4 3"
                />
              )}
            </svg>

            {/* City Markers */}
            {cityCoordinates.map((coord, idx) => {
              const isSelected = activePin?.city?.name === coord.city.name;

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedPin(coord)}
                  style={{
                    position: 'absolute',
                    left: `${coord.x}%`,
                    top: `${coord.y}%`,
                    transform: 'translate(-50%, -50%)',
                    cursor: 'pointer',
                    zIndex: 20
                  }}
                >
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    background: isSelected ? 'linear-gradient(135deg, #0d9488, #10b981)' : '#ffffff',
                    color: isSelected ? '#ffffff' : '#0f172a',
                    padding: '6px 12px', borderRadius: '12px',
                    boxShadow: isSelected ? '0 8px 24px rgba(13,148,136,0.4)' : '0 2px 8px rgba(0,0,0,0.1)',
                    border: isSelected ? '2px solid #ffffff' : '1.5px solid #cbd5e1',
                    transition: 'all 0.2s ease'
                  }}>
                    <span style={{
                      width: '20px', height: '20px', borderRadius: '50%',
                      background: isSelected ? 'rgba(255,255,255,0.25)' : '#0d9488',
                      color: '#ffffff', fontSize: '10px', fontWeight: 900,
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      {idx + 1}
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: 900 }}>
                      {coord.city.name}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Route Sequence Bar */}
          <div style={{
            background: '#f8fafc', padding: '12px 18px', borderRadius: '14px',
            border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto'
          }}>
            {cityCoordinates.map((coord, idx) => (
              <React.Fragment key={idx}>
                <button
                  onClick={() => setSelectedPin(coord)}
                  style={{
                    padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 800,
                    background: activePin?.city?.name === coord.city.name ? '#0d9488' : '#ffffff',
                    color: activePin?.city?.name === coord.city.name ? '#ffffff' : '#334155',
                    border: '1px solid #cbd5e1', cursor: 'pointer', whiteSpace: 'nowrap'
                  }}
                >
                  {idx + 1}. {coord.city.name}
                </button>
                {idx < cityCoordinates.length - 1 && (
                  <span style={{ color: '#0d9488', fontWeight: 900 }}>➔</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Selected City Focus Card */}
        {activePin && (
          <div style={{
            background: '#ffffff', borderRadius: '24px', padding: '24px',
            border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px'
          }}>
            <div>
              <div style={{ height: '160px', borderRadius: '16px', overflow: 'hidden', position: 'relative', marginBottom: '14px' }}>
                <img
                  src={activePin.city.imageUrl}
                  alt={activePin.city.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.7)', color: '#ffffff', borderRadius: '99px', padding: '3px 8px', fontSize: '11px', fontWeight: 800 }}>
                  ★ {activePin.city.popularity || 95}/100 Popularity
                </div>
              </div>

              <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a', margin: '0 0 4px' }}>
                {activePin.city.name}
              </h3>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 14px' }}>
                {activePin.city.country}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
                <div style={{ background: '#f0fdf9', padding: '10px', borderRadius: '12px', border: '1px solid #a7f3d0' }}>
                  <div style={{ fontSize: '10px', fontWeight: 800, color: '#0f766e', textTransform: 'uppercase' }}>Forecast</div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>24°C Sunny</div>
                </div>

                <div style={{ background: '#faf5ff', padding: '10px', borderRadius: '12px', border: '1px solid #e9d5ff' }}>
                  <div style={{ fontSize: '10px', fontWeight: 800, color: '#7c3aed', textTransform: 'uppercase' }}>Cost Rating</div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>{activePin.city.costIndex || 80}/100</div>
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px', color: '#475569', fontWeight: 600 }}>
                ✈️ {activePin.distance}
              </div>
            </div>

            <button
              onClick={() => onSelectCity(activePin.city)}
              style={{
                width: '100%', padding: '12px', borderRadius: '12px',
                background: 'linear-gradient(135deg, #0d9488 0%, #10b981 100%)',
                color: '#ffffff', border: 'none', fontSize: '13px', fontWeight: 800,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                boxShadow: '0 4px 12px rgba(13,148,136,0.3)'
              }}
            >
              <MapPin size={15} />
              <span>Explore Activities in {activePin.city.name}</span>
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
