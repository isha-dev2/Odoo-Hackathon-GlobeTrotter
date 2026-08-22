import React from 'react';
import { Compass, MapPin, Calendar, Plane, Plus, Sparkles, Navigation, Globe2 } from 'lucide-react';

export default function HeroBanner({ cities, onOpenAddModal }) {
  const totalDays = cities.reduce((acc, c) => acc + c.days, 0);

  return (
    <div className="hero-banner glass-card">
      <div className="hero-content">
        <div className="hero-badge">
          <Sparkles size={14} className="gradient-text" />
          <span>Personalized Multi-City Journey</span>
        </div>

        <h2 className="hero-title">
          Explore the World, <span className="gradient-text">One City at a Time</span>
        </h2>
        <p className="hero-description">
          Design your custom multi-city itinerary, visualize flight topologies, and track travel budgets effortlessly.
        </p>

        {/* Quick City Pills Track */}
        <div className="hero-city-pills">
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Globe2 size={15} color="var(--accent-cyan)" /> Route:
          </span>
          {cities.map((city, idx) => (
            <React.Fragment key={city.id}>
              <span className="hero-city-chip">
                {city.image && <img src={city.image} alt={city.name} className="chip-img" />}
                {city.name}
              </span>
              {idx < cities.length - 1 && (
                <span className="route-arrow">➔</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="hero-action-card">
        <div className="hero-stat-row">
          <div className="hero-mini-stat">
            <span className="mini-stat-num">{cities.length}</span>
            <span className="mini-stat-lbl">Cities</span>
          </div>
          <div className="hero-mini-stat">
            <span className="mini-stat-num">{totalDays}</span>
            <span className="mini-stat-lbl">Days</span>
          </div>
          <div className="hero-mini-stat">
            <span className="mini-stat-num">
              <Plane size={18} style={{ display: 'inline', color: 'var(--accent-cyan)' }} />
            </span>
            <span className="mini-stat-lbl">Connected</span>
          </div>
        </div>

        <button className="gradient-btn" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }} onClick={onOpenAddModal}>
          <Plus size={18} /> Add New Destination
        </button>
      </div>
    </div>
  );
}
