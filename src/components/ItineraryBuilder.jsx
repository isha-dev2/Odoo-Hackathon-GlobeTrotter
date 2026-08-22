import React from 'react';
import { Calendar, DollarSign, MapPin, Plus, Sparkles, Compass, ArrowRight, ShieldCheck } from 'lucide-react';
import CityCard from './CityCard';

export default function ItineraryBuilder({
  cities,
  onMoveCity,
  onDeleteCity,
  onDaysChange,
  onOpenAddModal,
  onAddActivity,
  onRemoveActivity,
  currency = 'USD'
}) {
  const currencySymbol = currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : currency === 'INR' ? '₹' : '$';

  const totalDays = cities.reduce((acc, c) => acc + c.days, 0);
  const totalHotels = cities.reduce((acc, c) => acc + (c.days * c.costPerNight), 0);
  const totalTransport = cities.reduce((acc, c) => acc + (c.transportToNext?.cost || 0), 0);
  const totalEstCost = totalHotels + totalTransport + (totalDays * 50);

  return (
    <div>
      {/* Top Trip Quick Stats Banner */}
      <div className="stats-banner">
        <div className="glass-card stat-card">
          <div className="stat-icon">
            <Compass size={22} />
          </div>
          <div>
            <div className="stat-val">{cities.length}</div>
            <div className="stat-lbl">Cities Explored</div>
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-icon" style={{ color: 'var(--accent-indigo)' }}>
            <Calendar size={22} />
          </div>
          <div>
            <div className="stat-val">{totalDays}</div>
            <div className="stat-lbl">Total Days & Nights</div>
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-icon" style={{ color: 'var(--accent-emerald)' }}>
            <DollarSign size={22} />
          </div>
          <div>
            <div className="stat-val">{currencySymbol}{totalEstCost.toLocaleString()}</div>
            <div className="stat-lbl">Est. Total Expenditure</div>
          </div>
        </div>
      </div>

      {/* Main Timeline Section */}
      <div className="timeline-section">
        <div className="timeline-list">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Destinations Timeline</h2>
            <button className="gradient-btn" onClick={onOpenAddModal}>
              <Plus size={18} /> Add Destination
            </button>
          </div>

          {cities.length === 0 ? (
            <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
              <MapPin size={40} color="var(--accent-cyan)" style={{ marginBottom: '1rem' }} />
              <h3>Your itinerary is currently empty</h3>
              <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0 1.5rem 0' }}>
                Add your first city or select a pre-made trip template to get started!
              </p>
              <button className="gradient-btn" onClick={onOpenAddModal}>
                <Plus size={18} /> Add Destination City
              </button>
            </div>
          ) : (
            cities.map((city, index) => (
              <CityCard
                key={city.id}
                city={city}
                index={index}
                totalCities={cities.length}
                onMove={onMoveCity}
                onDelete={onDeleteCity}
                onDaysChange={onDaysChange}
                onAddActivity={onAddActivity}
                onRemoveActivity={onRemoveActivity}
                currency={currency}
              />
            ))
          )}
        </div>

        {/* Sidebar Summary & Tips Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={18} className="gradient-text" /> Smart Route Recommendations
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
              <div style={{ padding: '0.75rem', background: 'rgba(56, 189, 248, 0.08)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--accent-cyan)' }}>
                <strong>Optimal Sequence:</strong> Keep flight connections under 3 hours by prioritizing neighboring countries.
              </div>
              <div style={{ padding: '0.75rem', background: 'rgba(99, 102, 241, 0.08)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--accent-indigo)' }}>
                <strong>Rail Pass Savings:</strong> High-speed rail is 40% cheaper when booked 30 days in advance in Europe.
              </div>
              <div style={{ padding: '0.75rem', background: 'rgba(16, 185, 129, 0.08)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--accent-emerald)' }}>
                <strong>Best Travel Pace:</strong> Spend at least 3 nights per major hub city for optimal sightseeing.
              </div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', color: '#FFFFFF' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem', color: '#FFFFFF' }}>Ready for Departure?</h4>
            <p style={{ fontSize: '0.8rem', color: '#94A3B8', marginBottom: '1rem' }}>
              Export your full itinerary, schedule notifications, and sync to your calendar.
            </p>
            <button className="gradient-btn" style={{ width: '100%', justifyContent: 'center' }}>
              Confirm & Book Itinerary <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
