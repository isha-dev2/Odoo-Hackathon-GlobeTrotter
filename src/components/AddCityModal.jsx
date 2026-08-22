import React, { useState } from 'react';
import { X, Plus, MapPin, DollarSign, Calendar, Plane } from 'lucide-react';

const popularCities = [
  { name: 'Paris', country: 'France', costPerNight: 160, highlight: 'Eiffel Tower & Louvre', weather: '☀️ 22°C Clear', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80', lat: 48.8566, lng: 2.3522 },
  { name: 'Rome', country: 'Italy', costPerNight: 130, highlight: 'Colosseum & Vatican', weather: '🌤️ 26°C Sunny', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80', lat: 41.9028, lng: 12.4964 },
  { name: 'Tokyo', country: 'Japan', costPerNight: 170, highlight: 'Shibuya & Mount Fuji', weather: '☀️ 21°C Pleasant', image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80', lat: 35.6762, lng: 139.6503 },
  { name: 'Kyoto', country: 'Japan', costPerNight: 140, highlight: 'Fushimi Inari & Temples', weather: '🌸 20°C Scenic', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80', lat: 35.0116, lng: 135.7681 },
  { name: 'Barcelona', country: 'Spain', costPerNight: 120, highlight: 'Sagrada Família & Beach', weather: '☀️ 27°C Coastal', image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=600&q=80', lat: 41.3851, lng: 2.1734 },
  { name: 'Amsterdam', country: 'Netherlands', costPerNight: 150, highlight: 'Canals & Van Gogh Museum', weather: '⛅ 19°C Mild', image: 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=600&q=80', lat: 52.3676, lng: 4.9041 },
  { name: 'Florence', country: 'Italy', costPerNight: 140, highlight: 'Duomo & Uffizi', weather: '☀️ 25°C Sunny', image: 'https://images.unsplash.com/photo-1543429776-2782fc8e1acd?auto=format&fit=crop&w=600&q=80', lat: 43.7696, lng: 11.2558 },
  { name: 'Venice', country: 'Italy', costPerNight: 165, highlight: 'Grand Canal & Gondola', weather: '🌤️ 23°C Pleasant', image: 'https://images.unsplash.com/photo-1514890547357-a9ee288728e0?auto=format&fit=crop&w=600&q=80', lat: 45.4408, lng: 12.3155 }
];

export default function AddCityModal({ isOpen, onClose, onAddCity }) {
  const [selectedCity, setSelectedCity] = useState(popularCities[0]);
  const [customName, setCustomName] = useState('');
  const [customCountry, setCustomCountry] = useState('');
  const [days, setDays] = useState(3);
  const [costPerNight, setCostPerNight] = useState(150);
  const [highlight, setHighlight] = useState('');
  const [transportType, setTransportType] = useState('flight');
  const [isCustom, setIsCustom] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const cityData = {
      id: 'city-' + Date.now(),
      name: isCustom ? customName : selectedCity.name,
      country: isCustom ? customCountry : selectedCity.country,
      days: Number(days),
      costPerNight: Number(costPerNight),
      highlight: isCustom ? highlight : (selectedCity.highlight || highlight),
      weather: isCustom ? '☀️ 24°C Sunny' : selectedCity.weather,
      image: isCustom 
        ? 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80' 
        : selectedCity.image,
      arrivalDate: '2026-09-15',
      departureDate: '2026-09-18',
      activities: [
        { title: 'Historic Walking Tour', category: 'sightseeing' },
        { title: 'Local Cuisine Experience', category: 'food' }
      ],
      lat: isCustom ? 45.0 : selectedCity.lat,
      lng: isCustom ? 10.0 : selectedCity.lng,
      transportToNext: {
        type: transportType,
        duration: transportType === 'flight' ? '2h 15m' : '3h 30m',
        cost: transportType === 'flight' ? 120 : 65,
        distance: '750 km'
      }
    };
    onAddCity(cityData);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Add Destination City</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Expand your multi-city travel itinerary</p>
          </div>
          <button className="icon-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Select City</label>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <button
                type="button"
                className={`btn-secondary ${!isCustom ? 'active' : ''}`}
                onClick={() => setIsCustom(false)}
                style={{ flex: 1, justifyContent: 'center', borderColor: !isCustom ? 'var(--accent-cyan)' : 'var(--border-subtle)' }}
              >
                Popular Destinations
              </button>
              <button
                type="button"
                className={`btn-secondary ${isCustom ? 'active' : ''}`}
                onClick={() => setIsCustom(true)}
                style={{ flex: 1, justifyContent: 'center', borderColor: isCustom ? 'var(--accent-cyan)' : 'var(--border-subtle)' }}
              >
                Custom Location
              </button>
            </div>

            {!isCustom ? (
              <select
                className="form-select"
                value={selectedCity.name}
                onChange={(e) => {
                  const found = popularCities.find(c => c.name === e.target.value);
                  if (found) {
                    setSelectedCity(found);
                    setCostPerNight(found.costPerNight);
                  }
                }}
              >
                {popularCities.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}, {c.country} (${c.costPerNight}/night)
                  </option>
                ))}
              </select>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <input
                  className="form-input"
                  placeholder="City Name (e.g. Vienna)"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  required
                />
                <input
                  className="form-input"
                  placeholder="Country (e.g. Austria)"
                  value={customCountry}
                  onChange={(e) => setCustomCountry(e.target.value)}
                  required
                />
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="form-group">
            <div>
              <label className="form-label">Stay Duration (Nights)</label>
              <input
                type="number"
                min="1"
                max="30"
                className="form-input"
                value={days}
                onChange={(e) => setDays(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="form-label">Est. Hotel ($/night)</label>
              <input
                type="number"
                min="30"
                className="form-input"
                value={costPerNight}
                onChange={(e) => setCostPerNight(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Transport to Next Destination</label>
            <select
              className="form-select"
              value={transportType}
              onChange={(e) => setTransportType(e.target.value)}
            >
              <option value="flight">✈️ Flight ($120 avg)</option>
              <option value="train">🚄 High-Speed Train ($65 avg)</option>
              <option value="bus">🚌 Express Bus ($30 avg)</option>
              <option value="car">🚗 Rental Car ($50 avg)</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="gradient-btn" style={{ flex: 1, justifyContent: 'center' }}>
              <Plus size={18} /> Add to Itinerary
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
