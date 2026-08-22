import React, { useState } from 'react';
import {
  Plus, Trash2, MapPin, Calendar, Clock, DollarSign, GripVertical,
  ChevronDown, ChevronUp, Star, Eye, Tag, ArrowUp, ArrowDown,
  Plane, Train, Car, Sparkles, Check, Compass
} from 'lucide-react';
import { MOCK_CITIES, MOCK_ACTIVITIES } from '../api/client';

const ACTIVITY_CATEGORIES = ['Sightseeing', 'Food', 'Adventure', 'Culture', 'Shopping', 'Relaxation', 'Nightlife', 'Transport'];

const CAT_COLORS = {
  Sightseeing: { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe', emoji: '🎯' },
  Food: { bg: '#fffbeb', text: '#b45309', border: '#fde68a', emoji: '🍽️' },
  Adventure: { bg: '#ecfdf5', text: '#047857', border: '#a7f3d0', emoji: '⛺' },
  Culture: { bg: '#fdf2f8', text: '#be185d', border: '#fbcfe8', emoji: '🏛️' },
  Shopping: { bg: '#faf5ff', text: '#6b21a8', border: '#e9d5ff', emoji: '🛍️' },
  Relaxation: { bg: '#ecfeff', text: '#0e7490', border: '#a5f3fc', emoji: '🧘' },
  Nightlife: { bg: '#fdf4ff', text: '#7e22ce', border: '#f5d0fe', emoji: '🎉' },
  Transport: { bg: '#f8fafc', text: '#334155', border: '#cbd5e1', emoji: '🚌' },
};

export default function ItineraryBuilder({
  currentTrip,
  onUpdateTrip,
  onNavigateToView,
  currencySymbol = '$'
}) {
  const [expandedStop, setExpandedStop] = useState(null);
  const [newStopCity, setNewStopCity] = useState('');
  const [citySuggestionsOpen, setCitySuggestionsOpen] = useState(false);
  const [addingActivity, setAddingActivity] = useState(null); // stopId
  const [newAct, setNewAct] = useState({
    name: '', category: 'Sightseeing', duration: '2 hours', cost: '', notes: '', time: '10:00 AM'
  });

  if (!currentTrip) {
    return (
      <div style={{
        background: '#ffffff', borderRadius: '24px', padding: '60px 24px',
        textAlign: 'center', border: '2px dashed #cbd5e1'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🗺️</div>
        <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a' }}>No Trip Selected</h2>
        <p style={{ fontSize: '14px', color: '#64748b', marginTop: '6px' }}>
          Please select or create a trip to start constructing your day-wise itinerary.
        </p>
      </div>
    );
  }

  const stops = currentTrip.stops || [];

  const addStop = (cityNameToAdd) => {
    const city = (cityNameToAdd || newStopCity).trim();
    if (!city) return;

    const matchedCity = MOCK_CITIES.find(c => c.name.toLowerCase() === city.toLowerCase()) || {
      id: `custom-city-${Date.now()}`,
      name: city,
      country: 'Global Destination',
      costIndex: 70,
      popularity: 85,
    };

    const newStop = {
      id: `stop-${Date.now()}`,
      city: matchedCity,
      startDate: currentTrip.startDate,
      endDate: currentTrip.endDate,
      order: stops.length + 1,
      transitMode: 'Flight',
      activities: [],
    };

    const updated = { ...currentTrip, stops: [...stops, newStop] };
    onUpdateTrip(updated);
    setNewStopCity('');
    setCitySuggestionsOpen(false);
    setExpandedStop(newStop.id);
  };

  const removeStop = (stopId) => {
    const updatedStops = stops.filter(s => s.id !== stopId).map((s, idx) => ({ ...s, order: idx + 1 }));
    onUpdateTrip({ ...currentTrip, stops: updatedStops });
    if (expandedStop === stopId) setExpandedStop(null);
  };

  const moveStop = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= stops.length) return;
    const newStops = [...stops];
    const temp = newStops[index];
    newStops[index] = newStops[targetIndex];
    newStops[targetIndex] = temp;
    const reordered = newStops.map((s, idx) => ({ ...s, order: idx + 1 }));
    onUpdateTrip({ ...currentTrip, stops: reordered });
  };

  const addActivity = (stopId) => {
    if (!newAct.name.trim()) return;
    const activity = {
      ...newAct,
      id: `act-${Date.now()}`,
      cost: parseFloat(newAct.cost) || 0,
    };
    const updated = {
      ...currentTrip,
      stops: stops.map(s => s.id === stopId ? { ...s, activities: [...(s.activities || []), activity] } : s)
    };
    onUpdateTrip(updated);
    setNewAct({ name: '', category: 'Sightseeing', duration: '2 hours', cost: '', notes: '', time: '10:00 AM' });
    setAddingActivity(null);
  };

  const addPresetActivity = (stopId, preset) => {
    const activity = {
      id: `act-${Date.now()}`,
      name: preset.name,
      category: preset.category,
      duration: `${Math.round(preset.duration / 60)} hours`,
      cost: preset.cost || 0,
      notes: preset.description || '',
      time: '11:00 AM'
    };
    const updated = {
      ...currentTrip,
      stops: stops.map(s => s.id === stopId ? { ...s, activities: [...(s.activities || []), activity] } : s)
    };
    onUpdateTrip(updated);
  };

  const removeActivity = (stopId, actId) => {
    onUpdateTrip({
      ...currentTrip,
      stops: stops.map(s => s.id === stopId ? { ...s, activities: s.activities.filter(a => a.id !== actId) } : s)
    });
  };

  const totalCost = stops.reduce((sum, s) => sum + (s.activities || []).reduce((a, act) => a + (act.cost || 0), 0), 0);
  const totalActivities = stops.reduce((sum, s) => sum + (s.activities?.length || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* 1. Builder Top Bar */}
      <div style={{
        background: 'linear-gradient(135deg, #042f2e 0%, #064e3b 40%, #0f172a 100%)',
        borderRadius: '24px', padding: '32px 36px',
        position: 'relative', overflow: 'hidden',
        boxShadow: '0 12px 36px -8px rgba(4, 47, 46, 0.4)',
        border: '1px solid rgba(16, 185, 129, 0.2)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.35)', borderRadius: '99px', padding: '4px 12px', marginBottom: '10px' }}>
              <Compass size={12} color="#34d399" />
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#6ee7b7', letterSpacing: '0.05em' }}>
                INTERACTIVE ITINERARY WORKSPACE
              </span>
            </div>

            <h1 style={{ fontSize: '28px', fontWeight: 900, color: '#ffffff', margin: 0, letterSpacing: '-0.5px' }}>
              {currentTrip.name}
            </h1>

            <div style={{ display: 'flex', gap: '18px', marginTop: '10px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '13px', color: '#cbd5e1', fontWeight: 700 }}>
                📍 {stops.length} Cities
              </span>
              <span style={{ fontSize: '13px', color: '#cbd5e1', fontWeight: 700 }}>
                🎯 {totalActivities} Experiences
              </span>
              <span style={{ fontSize: '13px', color: '#6ee7b7', fontWeight: 900 }}>
                💰 {currencySymbol}{totalCost.toLocaleString()} Estimated Cost
              </span>
            </div>
          </div>

          <button
            onClick={onNavigateToView}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: 'linear-gradient(135deg, #0d9488 0%, #10b981 100%)',
              color: '#ffffff', border: 'none', borderRadius: '14px',
              padding: '12px 22px', fontSize: '13px', fontWeight: 800, cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(13,148,136,0.4)', transition: 'transform 0.15s ease'
            }}
          >
            <Eye size={16} />
            <span>Preview Master Itinerary</span>
          </button>
        </div>
      </div>

      {/* 2. Add Stop Card with Quick Suggestions */}
      <div style={{
        background: '#ffffff', borderRadius: '20px', padding: '20px 24px',
        border: '1.5px solid #cbd5e1', boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
        position: 'relative'
      }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '12px',
            background: '#f0fdf9', display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0
          }}>
            <MapPin size={20} color="#0d9488" />
          </div>

          <input
            value={newStopCity}
            onChange={e => { setNewStopCity(e.target.value); setCitySuggestionsOpen(true); }}
            onFocus={() => setCitySuggestionsOpen(true)}
            onKeyDown={e => e.key === 'Enter' && addStop()}
            placeholder="Search & Add a City Stop (e.g. Tokyo, Paris, Rome, Barcelona, Bali, New York)..."
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              fontSize: '15px', fontWeight: 600, color: '#0f172a', fontFamily: 'Inter, sans-serif'
            }}
          />

          <button
            onClick={() => addStop()}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: 'linear-gradient(135deg, #0d9488 0%, #10b981 100%)',
              color: '#ffffff', border: 'none', borderRadius: '12px',
              padding: '11px 20px', fontSize: '13px', fontWeight: 800, cursor: 'pointer', flexShrink: 0,
              boxShadow: '0 2px 8px rgba(13,148,136,0.3)'
            }}
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>Add City Stop</span>
          </button>
        </div>

        {/* Quick Suggestion Pills */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '14px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
            Popular Picks:
          </span>
          {['Jaipur', 'Goa', 'Munnar & Alleppey', 'Manali & Ladakh', 'Udaipur', 'Dubai', 'Paris', 'Tokyo'].map(city => (
            <button
              key={city}
              onClick={() => addStop(city)}
              style={{
                background: '#f1f5f9', border: '1px solid #e2e8f0',
                borderRadius: '99px', padding: '4px 12px',
                fontSize: '12px', fontWeight: 700, color: '#334155',
                cursor: 'pointer', transition: 'all 0.15s ease'
              }}
            >
              + {city}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Stops Workspace List */}
      {stops.length === 0 ? (
        <div style={{
          background: '#ffffff', borderRadius: '24px', padding: '60px 24px',
          textAlign: 'center', border: '2px dashed #cbd5e1'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🏙️</div>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>No City Stops in this Trip Yet</h3>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
            Type a destination in the bar above or click one of the popular picks to construct your itinerary.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {stops.map((stop, idx) => {
            const cityName = stop.city?.name || stop.city || 'City';
            const isExpanded = expandedStop === stop.id;
            const activities = stop.activities || [];
            const stopCost = activities.reduce((s, a) => s + (a.cost || 0), 0);

            return (
              <div
                key={stop.id}
                style={{
                  background: '#ffffff', borderRadius: '22px',
                  border: isExpanded ? '2px solid #0d9488' : '1px solid #e2e8f0',
                  boxShadow: isExpanded ? '0 8px 28px rgba(13,148,136,0.12)' : '0 2px 10px rgba(0,0,0,0.03)',
                  overflow: 'hidden', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                {/* Stop Header Bar */}
                <div
                  style={{
                    padding: '18px 24px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    background: isExpanded ? '#f0fdf9' : '#ffffff',
                    borderBottom: isExpanded ? '1px solid #a7f3d0' : 'none',
                    cursor: 'pointer'
                  }}
                  onClick={() => setExpandedStop(isExpanded ? null : stop.id)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {/* Reorder Buttons */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }} onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => moveStop(idx, -1)}
                        disabled={idx === 0}
                        style={{
                          background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px',
                          padding: '2px 4px', cursor: idx === 0 ? 'not-allowed' : 'pointer',
                          opacity: idx === 0 ? 0.3 : 1
                        }}
                      >
                        <ArrowUp size={12} color="#334155" />
                      </button>
                      <button
                        onClick={() => moveStop(idx, 1)}
                        disabled={idx === stops.length - 1}
                        style={{
                          background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px',
                          padding: '2px 4px', cursor: idx === stops.length - 1 ? 'not-allowed' : 'pointer',
                          opacity: idx === stops.length - 1 ? 0.3 : 1
                        }}
                      >
                        <ArrowDown size={12} color="#334155" />
                      </button>
                    </div>

                    {/* Order Circle Badge */}
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '12px',
                      background: 'linear-gradient(135deg, #0d9488 0%, #10b981 100%)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '16px', fontWeight: 900, color: '#ffffff',
                      boxShadow: '0 2px 8px rgba(13,148,136,0.3)'
                    }}>
                      {idx + 1}
                    </div>

                    <div>
                      <div style={{ fontSize: '18px', fontWeight: 900, color: '#0f172a' }}>
                        📍 {cityName}
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px', fontWeight: 600 }}>
                        {activities.length} activities scheduled · <strong style={{ color: '#0d9488' }}>{currencySymbol}{stopCost.toLocaleString()} estimated</strong>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }} onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => removeStop(stop.id)}
                      style={{
                        width: '34px', height: '34px', borderRadius: '10px',
                        background: '#fff5f5', border: '1px solid #fecaca',
                        color: '#ef4444', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}
                      title="Remove City Stop"
                    >
                      <Trash2 size={15} />
                    </button>

                    <button
                      onClick={() => setExpandedStop(isExpanded ? null : stop.id)}
                      style={{
                        padding: '6px 12px', borderRadius: '10px',
                        background: isExpanded ? '#0d9488' : '#f1f5f9',
                        color: isExpanded ? '#ffffff' : '#334155',
                        border: 'none', fontSize: '12px', fontWeight: 800, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '4px'
                      }}
                    >
                      <span>{isExpanded ? 'Collapse' : 'Expand & Edit'}</span>
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                  </div>
                </div>

                {/* Expanded Activity Editor */}
                {isExpanded && (
                  <div style={{ padding: '24px' }}>
                    
                    {/* Quick Preset Recommendations for this stop */}
                    <div style={{ marginBottom: '20px', background: '#f8fafc', borderRadius: '16px', padding: '16px', border: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: '12px', fontWeight: 800, color: '#334155', textTransform: 'uppercase', marginBottom: '10px' }}>
                        ⚡ Recommended Instant Experiences for {cityName}:
                      </div>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {MOCK_ACTIVITIES.slice(0, 4).map((preset) => (
                          <button
                            key={preset.id}
                            onClick={() => addPresetActivity(stop.id, preset)}
                            style={{
                              display: 'flex', alignItems: 'center', gap: '6px',
                              background: '#ffffff', border: '1px solid #cbd5e1',
                              borderRadius: '10px', padding: '8px 12px',
                              fontSize: '12px', fontWeight: 700, color: '#0f172a',
                              cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                            }}
                          >
                            <Plus size={13} color="#0d9488" strokeWidth={2.5} />
                            <span>{preset.name}</span>
                            <span style={{ fontSize: '11px', color: '#0d9488', fontWeight: 800 }}>({currencySymbol}{preset.cost})</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Existing Activities in Stop */}
                    {activities.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                        {activities.map((act) => {
                          const catStyle = CAT_COLORS[act.category] || CAT_COLORS.Sightseeing;
                          return (
                            <div
                              key={act.id}
                              style={{
                                display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
                                background: '#f8fafc', borderRadius: '14px', padding: '14px 18px',
                                border: '1px solid #e2e8f0', gap: '14px'
                              }}
                            >
                              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <div style={{
                                  width: '36px', height: '36px', borderRadius: '10px',
                                  background: catStyle.bg, border: `1px solid ${catStyle.border}`,
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  fontSize: '16px', flexShrink: 0
                                }}>
                                  {catStyle.emoji}
                                </div>

                                <div>
                                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>
                                    {act.name}
                                  </div>
                                  <div style={{ display: 'flex', gap: '10px', marginTop: '4px', flexWrap: 'wrap', fontSize: '12px', color: '#64748b' }}>
                                    <span style={{ fontWeight: 800, color: catStyle.text }}>{act.category}</span>
                                    {act.time && <span>⏰ {act.time}</span>}
                                    {act.duration && <span>⏱ {act.duration}</span>}
                                    <span style={{ fontWeight: 800, color: '#0d9488' }}>💰 {currencySymbol}{act.cost}</span>
                                  </div>
                                  {act.notes && (
                                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                                      {act.notes}
                                    </div>
                                  )}
                                </div>
                              </div>

                              <button
                                onClick={() => removeActivity(stop.id, act.id)}
                                style={{
                                  background: 'transparent', border: 'none',
                                  color: '#94a3b8', cursor: 'pointer', padding: '6px'
                                }}
                                title="Delete activity"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Add Custom Activity Form Modal / Box */}
                    {addingActivity === stop.id ? (
                      <div style={{
                        background: '#f0fdf9', borderRadius: '18px', padding: '20px',
                        border: '1.5px solid #a7f3d0'
                      }}>
                        <div style={{ fontSize: '14px', fontWeight: 900, color: '#0f766e', marginBottom: '14px' }}>
                          ✨ Add Custom Experience in {cityName}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          <input
                            value={newAct.name}
                            onChange={e => setNewAct({ ...newAct, name: e.target.value })}
                            placeholder="Activity Title (e.g. Guided Louvre Museum Tour, Sunrise Hike, Wine Tasting)..."
                            style={{
                              background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '12px',
                              padding: '10px 14px', fontSize: '14px', fontWeight: 600, color: '#0f172a', outline: 'none'
                            }}
                          />

                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
                            <div>
                              <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', display: 'block', marginBottom: '4px' }}>Category</label>
                              <select
                                value={newAct.category}
                                onChange={e => setNewAct({ ...newAct, category: e.target.value })}
                                style={{
                                  width: '100%', background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '10px',
                                  padding: '8px 12px', fontSize: '13px', fontWeight: 600, color: '#0f172a', outline: 'none'
                                }}
                              >
                                {ACTIVITY_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                              </select>
                            </div>

                            <div>
                              <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', display: 'block', marginBottom: '4px' }}>Time Slot</label>
                              <input
                                value={newAct.time}
                                onChange={e => setNewAct({ ...newAct, time: e.target.value })}
                                placeholder="10:00 AM"
                                style={{
                                  width: '100%', background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '10px',
                                  padding: '8px 12px', fontSize: '13px', fontWeight: 600, color: '#0f172a', outline: 'none'
                                }}
                              />
                            </div>

                            <div>
                              <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', display: 'block', marginBottom: '4px' }}>Duration</label>
                              <input
                                value={newAct.duration}
                                onChange={e => setNewAct({ ...newAct, duration: e.target.value })}
                                placeholder="2 hours"
                                style={{
                                  width: '100%', background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '10px',
                                  padding: '8px 12px', fontSize: '13px', fontWeight: 600, color: '#0f172a', outline: 'none'
                                }}
                              />
                            </div>

                            <div>
                              <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', display: 'block', marginBottom: '4px' }}>Cost ({currencySymbol})</label>
                              <input
                                type="number"
                                value={newAct.cost}
                                onChange={e => setNewAct({ ...newAct, cost: e.target.value })}
                                placeholder="45"
                                style={{
                                  width: '100%', background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '10px',
                                  padding: '8px 12px', fontSize: '13px', fontWeight: 600, color: '#0f172a', outline: 'none'
                                }}
                              />
                            </div>
                          </div>

                          <input
                            value={newAct.notes}
                            onChange={e => setNewAct({ ...newAct, notes: e.target.value })}
                            placeholder="Special notes, booking links, or instructions (optional)..."
                            style={{
                              background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '12px',
                              padding: '10px 14px', fontSize: '13px', fontWeight: 500, color: '#0f172a', outline: 'none'
                            }}
                          />

                          <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                            <button
                              onClick={() => addActivity(stop.id)}
                              style={{
                                flex: 1, background: 'linear-gradient(135deg, #0d9488 0%, #10b981 100%)',
                                color: '#ffffff', border: 'none', borderRadius: '12px',
                                padding: '12px', fontSize: '13px', fontWeight: 800, cursor: 'pointer'
                              }}
                            >
                              Save Experience
                            </button>
                            <button
                              onClick={() => setAddingActivity(null)}
                              style={{
                                padding: '12px 20px', borderRadius: '12px',
                                border: '1.5px solid #cbd5e1', background: '#ffffff',
                                fontSize: '13px', fontWeight: 800, color: '#64748b', cursor: 'pointer'
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setAddingActivity(stop.id)}
                        style={{
                          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                          background: '#ffffff', border: '2px dashed #99f6e4',
                          borderRadius: '16px', padding: '14px', fontSize: '13px', fontWeight: 800,
                          color: '#0d9488', cursor: 'pointer', transition: 'all 0.15s ease'
                        }}
                      >
                        <Plus size={16} strokeWidth={2.5} />
                        <span>Add Custom Activity to {cityName}</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
