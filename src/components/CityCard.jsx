import React from 'react';
import { 
  ChevronUp, ChevronDown, Trash2, Calendar, DollarSign, 
  Plane, Train, Bus, Car, Plus, Tag, Clock, MapPin, Sun, Sparkles
} from 'lucide-react';

const transportIcons = {
  flight: Plane,
  train: Train,
  bus: Bus,
  car: Car
};

export default function CityCard({
  city,
  index,
  totalCities,
  onMove,
  onDelete,
  onDaysChange,
  onAddActivity,
  onRemoveActivity,
  currency = 'USD'
}) {
  const TransportIcon = transportIcons[city.transportToNext?.type || 'flight'] || Plane;
  const currencySymbol = currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : currency === 'INR' ? '₹' : '$';

  return (
    <div style={{ position: 'relative' }}>
      <div className="glass-card city-card">
        <div className="city-card-banner">
          {city.image && (
            <div className="city-thumb-wrapper">
              <img src={city.image} alt={city.name} className="city-thumb-img" />
              <div className="city-thumb-overlay" />
            </div>
          )}

          <div className="city-header-content">
            <div className="city-title-area">
              <div className="city-number-badge">{index + 1}</div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span className="city-name">{city.name}</span>
                  <span className="country-tag">{city.country}</span>
                  {city.weather && (
                    <span className="weather-pill">
                      {city.weather}
                    </span>
                  )}
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Stay: {city.arrivalDate} ➔ {city.departureDate}
                </p>
              </div>
            </div>

            <div className="city-actions">
              <button 
                className="icon-btn" 
                onClick={() => onMove(index, -1)}
                disabled={index === 0}
                style={{ opacity: index === 0 ? 0.3 : 1 }}
                title="Move Up"
              >
                <ChevronUp size={18} />
              </button>
              <button 
                className="icon-btn" 
                onClick={() => onMove(index, 1)}
                disabled={index === totalCities - 1}
                style={{ opacity: index === totalCities - 1 ? 0.3 : 1 }}
                title="Move Down"
              >
                <ChevronDown size={18} />
              </button>
              <button 
                className="icon-btn danger" 
                onClick={() => onDelete(city.id)}
                title="Delete City"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* City Details Metrics */}
        <div className="city-details-grid">
          <div className="detail-item">
            <span className="detail-label">Nights Stay</span>
            <div className="detail-value">
              <div className="days-control">
                <button className="counter-btn" onClick={() => onDaysChange(city.id, -1)}>-</button>
                <span>{city.days} Nights</span>
                <button className="counter-btn" onClick={() => onDaysChange(city.id, 1)}>+</button>
              </div>
            </div>
          </div>

          <div className="detail-item">
            <span className="detail-label">Est. Hotel Total</span>
            <div className="detail-value" style={{ color: 'var(--accent-cyan)' }}>
              {currencySymbol}{city.days * city.costPerNight}
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({currencySymbol}{city.costPerNight}/n)</span>
            </div>
          </div>

          <div className="detail-item">
            <span className="detail-label">Top Highlight</span>
            <div className="detail-value" style={{ fontSize: '0.85rem' }}>
              <MapPin size={15} style={{ color: 'var(--accent-amber)' }} />
              {city.highlight || 'Historic City Center'}
            </div>
          </div>
        </div>

        {/* Planned Experiences & Activities */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span className="detail-label">Planned Itinerary & Experiences</span>
            <button 
              style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem', fontWeight: 600 }}
              onClick={() => onAddActivity(city.id)}
            >
              <Plus size={14} /> Add Experience
            </button>
          </div>

          <div className="activities-list">
            {city.activities.map((act, i) => (
              <span key={i} className={`activity-tag ${act.category || 'sightseeing'}`}>
                <Tag size={12} />
                {act.title}
                <button 
                  onClick={() => onRemoveActivity(city.id, i)}
                  style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', marginLeft: '0.3rem', opacity: 0.7 }}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Transport connector line between cities */}
      {index < totalCities - 1 && city.transportToNext && (
        <div className="transport-connector">
          <div className="transport-badge">
            <TransportIcon size={16} style={{ color: 'var(--accent-cyan)' }} />
            <span>{city.transportToNext.duration} ({city.transportToNext.distance || 'Route'})</span>
            <span style={{ color: 'var(--accent-emerald)', fontWeight: '700' }}>+{currencySymbol}{city.transportToNext.cost}</span>
          </div>
        </div>
      )}
    </div>
  );
}
