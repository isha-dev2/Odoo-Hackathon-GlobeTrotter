import React from 'react';
import { Globe, MapPin, Download, Compass, Layers, Sun, Moon, DollarSign } from 'lucide-react';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  onExport, 
  onPresetSelect, 
  selectedPreset,
  theme,
  onToggleTheme,
  currency,
  setCurrency
}) {
  return (
    <header className="header-bar">
      <div className="logo-group">
        <div className="logo-icon-wrapper">
          <Globe className="text-white spin-globe" size={24} color="#FFFFFF" />
        </div>
        <div>
          <h1 className="logo-text gradient-text">GlobeTrotter</h1>
          <p className="logo-subtitle">Personalized Multi-City Travel Planner</p>
        </div>
      </div>

      <div className="nav-pills">
        <button
          className={`nav-pill ${activeTab === 'timeline' ? 'active' : ''}`}
          onClick={() => setActiveTab('timeline')}
        >
          <Compass size={18} />
          Itinerary Timeline
        </button>
        <button
          className={`nav-pill ${activeTab === 'map' ? 'active' : ''}`}
          onClick={() => setActiveTab('map')}
        >
          <MapPin size={18} />
          Interactive Map
        </button>
        <button
          className={`nav-pill ${activeTab === 'budget' ? 'active' : ''}`}
          onClick={() => setActiveTab('budget')}
        >
          <Layers size={18} />
          Budget & Breakdown
        </button>
      </div>

      <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
        <select 
          className="form-select"
          style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem', width: 'auto' }}
          value={selectedPreset}
          onChange={(e) => onPresetSelect(e.target.value)}
        >
          <option value="custom">✨ Custom Trip</option>
          <option value="europe">🇪🇺 Euro Capitals</option>
          <option value="asia">🇯🇵 East Asia</option>
          <option value="mediterranean">🇮🇹 Mediterranean</option>
        </select>

        <select 
          className="form-select"
          style={{ padding: '0.5rem 0.6rem', fontSize: '0.85rem', width: 'auto', fontWeight: 600 }}
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
        >
          <option value="USD">$ USD</option>
          <option value="EUR">€ EUR</option>
          <option value="GBP">£ GBP</option>
          <option value="INR">₹ INR</option>
        </select>

        <button 
          className="theme-toggle-btn" 
          onClick={onToggleTheme}
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} color="#F59E0B" />}
        </button>

        <button className="btn-secondary" onClick={onExport} title="Export Itinerary">
          <Download size={16} />
          Export
        </button>
      </div>
    </header>
  );
}
