import React, { useState } from 'react';
import { Plus, Trash2, MapPin, Calendar, Clock, DollarSign, GripVertical, ChevronDown, ChevronUp, Star, Eye, Tag } from 'lucide-react';
import api from '../api/client';

const ACTIVITY_CATEGORIES = ['Sightseeing', 'Food', 'Adventure', 'Culture', 'Shopping', 'Relaxation', 'Nightlife', 'Transport'];
const CAT_COLORS = {
  Sightseeing: { bg: '#eff6ff', text: '#1e40af' },
  Food: { bg: '#fef3c7', text: '#92400e' },
  Adventure: { bg: '#dcfce7', text: '#166534' },
  Culture: { bg: '#fce7f3', text: '#9d174d' },
  Shopping: { bg: '#faf5ff', text: '#5b21b6' },
  Relaxation: { bg: '#cffafe', text: '#164e63' },
  Nightlife: { bg: '#fdf4ff', text: '#7e22ce' },
  Transport: { bg: '#f1f5f9', text: '#475569' },
};

export default function ItineraryBuilder({ currentTrip, onUpdateTrip, onNavigateToView }) {
  const [expandedStop, setExpandedStop] = useState(null);
  const [newStopCity, setNewStopCity] = useState('');
  const [addingActivity, setAddingActivity] = useState(null); // stopId
  const [newAct, setNewAct] = useState({ name: '', category: 'Sightseeing', duration: '', cost: '', notes: '', time: '' });

  if (!currentTrip) {
    return (
      <div style={{
        background: 'white', borderRadius: 20, padding: '60px',
        textAlign: 'center', border: '1.5px dashed #e2e8f0'
      }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🗺️</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#374151' }}>No trip selected</div>
        <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 6 }}>Select or create a trip to start building your itinerary</div>
      </div>
    );
  }

  const stops = currentTrip.stops || [];

  const addStop = async () => {
    const cityName = newStopCity.trim();
    if (!cityName) return;
    try {
      let cityId = null;
      let cityObj = null;
      const searchRes = await api.get('/cities', { params: { q: cityName } });
      const foundCity = searchRes.data.cities?.find(c => c.name.toLowerCase() === cityName.toLowerCase());
      if (foundCity) {
        cityId = foundCity.id;
        cityObj = foundCity;
      } else {
        const createRes = await api.post('/cities', { name: cityName, country: 'Travel Destination' });
        cityId = createRes.data.city.id;
        cityObj = createRes.data.city;
      }

      const stopRes = await api.post('/stops', {
        tripId: currentTrip.id,
        cityId,
        startDate: currentTrip.startDate,
        endDate: currentTrip.endDate,
        order: stops.length + 1
      });

      if (stopRes.data && stopRes.data.stop) {
        const dbStop = stopRes.data.stop;
        dbStop.city = cityObj;
        const updated = { ...currentTrip, stops: [...stops, dbStop] };
        onUpdateTrip(updated);
        setNewStopCity('');
        setExpandedStop(dbStop.id);
      }
    } catch (err) {
      console.error('Failed to add stop to database:', err);
      const mockStop = {
        id: `stop-${Date.now()}`,
        city: { name: cityName },
        startDate: currentTrip.startDate,
        endDate: currentTrip.endDate,
        order: stops.length + 1,
        activities: [],
      };
      onUpdateTrip({ ...currentTrip, stops: [...stops, mockStop] });
      setNewStopCity('');
      setExpandedStop(mockStop.id);
    }
  };

  const removeStop = async (stopId) => {
    try {
      if (!stopId.startsWith('stop-')) {
        await api.delete(`/stops/${stopId}`);
      }
    } catch (err) {
      console.error('Failed to delete stop from database:', err);
    }
    onUpdateTrip({ ...currentTrip, stops: stops.filter(s => s.id !== stopId) });
    if (expandedStop === stopId) setExpandedStop(null);
  };

  const addActivity = async (stopId) => {
    if (!newAct.name.trim()) return;
    try {
      let durationInt = parseInt(newAct.duration) || null;
      const actPayload = {
        stopId,
        name: newAct.name.trim(),
        category: newAct.category,
        cost: parseFloat(newAct.cost) || 0,
        duration: durationInt,
        description: newAct.notes
      };

      let dbAct = null;
      if (!stopId.startsWith('stop-')) {
        const res = await api.post('/activities', actPayload);
        dbAct = res.data.activity;
      } else {
        dbAct = { ...newAct, id: `act-${Date.now()}`, cost: parseFloat(newAct.cost) || 0 };
      }

      const updated = {
        ...currentTrip,
        stops: stops.map(s => s.id === stopId ? { ...s, activities: [...(s.activities || []), dbAct] } : s)
      };
      onUpdateTrip(updated);
    } catch (err) {
      console.error('Failed to add activity on server:', err);
      const fallbackAct = { ...newAct, id: `act-${Date.now()}`, cost: parseFloat(newAct.cost) || 0 };
      const updated = {
        ...currentTrip,
        stops: stops.map(s => s.id === stopId ? { ...s, activities: [...(s.activities || []), fallbackAct] } : s)
      };
      onUpdateTrip(updated);
    }
    setNewAct({ name: '', category: 'Sightseeing', duration: '', cost: '', notes: '', time: '' });
    setAddingActivity(null);
  };

  const removeActivity = async (stopId, actId) => {
    try {
      if (!actId.startsWith('act-')) {
        await api.delete(`/activities/${actId}`);
      }
    } catch (err) {
      console.error('Failed to delete activity on server:', err);
    }
    onUpdateTrip({
      ...currentTrip,
      stops: stops.map(s => s.id === stopId ? { ...s, activities: s.activities.filter(a => a.id !== actId) } : s)
    });
  };

  const totalCost = stops.reduce((sum, s) => sum + (s.activities || []).reduce((a, act) => a + (act.cost || 0), 0), 0);
  const totalActivities = stops.reduce((sum, s) => sum + (s.activities?.length || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a, #134e4a)',
        borderRadius: 20, padding: '24px 28px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14
      }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: 'white', margin: 0, letterSpacing: '-0.5px' }}>
            {currentTrip.coverPhoto && currentTrip.coverPhoto.length <= 2 ? currentTrip.coverPhoto + ' ' : ''}{currentTrip.name}
          </h1>
          <div style={{ display: 'flex', gap: 16, marginTop: 6 }}>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>📍 {stops.length} cities</span>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>🎯 {totalActivities} activities</span>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>💰 ${totalCost.toLocaleString()} planned</span>
          </div>
        </div>
        <button
          onClick={onNavigateToView}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'linear-gradient(135deg, #0d9488, #10b981)',
            color: 'white', border: 'none', borderRadius: 12,
            padding: '10px 18px', fontSize: 12, fontWeight: 700, cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(13,148,136,0.4)'
          }}
        >
          <Eye size={13} /> View Itinerary
        </button>
      </div>

      {/* Add Stop */}
      <div style={{
        background: 'white', borderRadius: 16, padding: '16px 20px',
        border: '1.5px solid #e8f0ef',
        display: 'flex', gap: 10, alignItems: 'center'
      }}>
        <MapPin size={16} color="#0d9488" style={{ flexShrink: 0 }} />
        <input
          value={newStopCity}
          onChange={e => setNewStopCity(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addStop()}
          placeholder="Add a city stop (e.g. Tokyo, Paris, Dubai)..."
          style={{
            flex: 1, background: 'transparent', border: 'none', outline: 'none',
            fontSize: 13, color: '#0f172a', fontFamily: 'Inter, sans-serif'
          }}
        />
        <button onClick={addStop} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'linear-gradient(135deg, #0d9488, #10b981)',
          color: 'white', border: 'none', borderRadius: 10,
          padding: '8px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer', flexShrink: 0
        }}>
          <Plus size={13} /> Add Stop
        </button>
      </div>

      {/* Stops */}
      {stops.length === 0 ? (
        <div style={{
          background: 'white', borderRadius: 16, padding: '40px',
          textAlign: 'center', border: '1.5px dashed #e2e8f0'
        }}>
          <div style={{ fontSize: 32, marginBottom: 10 }}>🏙️</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#374151' }}>No city stops yet</div>
          <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>Add your first destination above to get started</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {stops.map((stop, idx) => {
            const cityName = stop.city?.name || stop.city || 'City';
            const isExpanded = expandedStop === stop.id;
            const activities = stop.activities || [];
            const stopCost = activities.reduce((s, a) => s + (a.cost || 0), 0);

            return (
              <div key={stop.id} style={{
                background: 'white', borderRadius: 18,
                border: isExpanded ? '2px solid #0d9488' : '1.5px solid #f1f5f9',
                boxShadow: isExpanded ? '0 4px 20px rgba(13,148,136,0.1)' : '0 1px 6px rgba(0,0,0,0.04)',
                overflow: 'hidden', transition: 'all 0.2s'
              }}>
                {/* Stop Header */}
                <button
                  onClick={() => setExpandedStop(isExpanded ? null : stop.id)}
                  style={{
                    width: '100%', padding: '16px 20px',
                    display: 'flex', alignItems: 'center', gap: 14,
                    background: isExpanded ? '#f0fdf9' : 'transparent',
                    border: 'none', cursor: 'pointer', textAlign: 'left'
                  }}
                >
                  {/* Stop Number */}
                  <div style={{
                    width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                    background: isExpanded
                      ? 'linear-gradient(135deg, #0d9488, #10b981)'
                      : 'linear-gradient(135deg, #f1f5f9, #e2e8f0)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14, fontWeight: 900,
                    color: isExpanded ? 'white' : '#64748b'
                  }}>
                    {idx + 1}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: '#0f172a' }}>📍 {cityName}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
                      {activities.length} activities · ${stopCost.toLocaleString()} estimated
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button
                      onClick={e => { e.stopPropagation(); removeStop(stop.id); }}
                      style={{
                        width: 28, height: 28, borderRadius: 8,
                        background: '#fff5f5', border: '1px solid #fed7d7',
                        color: '#e53e3e', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}
                    >
                      <Trash2 size={12} />
                    </button>
                    {isExpanded ? <ChevronUp size={16} color="#0d9488" /> : <ChevronDown size={16} color="#94a3b8" />}
                  </div>
                </button>

                {/* Expanded Activities */}
                {isExpanded && (
                  <div style={{ padding: '4px 20px 20px' }}>
                    {/* Activities List */}
                    {activities.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
                        {activities.map((act, aIdx) => {
                          const catColor = CAT_COLORS[act.category] || CAT_COLORS.Sightseeing;
                          return (
                            <div key={act.id || aIdx} style={{
                              display: 'flex', alignItems: 'flex-start', gap: 10,
                              background: '#f8fafc', borderRadius: 12, padding: '11px 14px'
                            }}>
                              <div style={{
                                fontSize: 18, flexShrink: 0, lineHeight: 1
                              }}>
                                {act.category === 'Food' ? '🍽️' :
                                 act.category === 'Adventure' ? '⛺' :
                                 act.category === 'Culture' ? '🏛️' :
                                 act.category === 'Shopping' ? '🛍️' :
                                 act.category === 'Relaxation' ? '🧘' :
                                 act.category === 'Nightlife' ? '🎉' :
                                 act.category === 'Transport' ? '🚌' : '🎯'}
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{act.name}</div>
                                <div style={{ display: 'flex', gap: 8, marginTop: 4, flexWrap: 'wrap' }}>
                                  <span style={{
                                    fontSize: 9, fontWeight: 700, color: catColor.text,
                                    background: catColor.bg, borderRadius: 99, padding: '2px 7px'
                                  }}>
                                    {act.category}
                                  </span>
                                  {act.time && (
                                    <span style={{ fontSize: 10, color: '#64748b', fontWeight: 600 }}>⏰ {act.time}</span>
                                  )}
                                  {act.duration && (
                                    <span style={{ fontSize: 10, color: '#64748b', fontWeight: 600 }}>⏱ {act.duration}</span>
                                  )}
                                  {act.cost > 0 && (
                                    <span style={{ fontSize: 10, color: '#0d9488', fontWeight: 700 }}>${act.cost}</span>
                                  )}
                                </div>
                                {act.notes && (
                                  <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>{act.notes}</div>
                                )}
                              </div>
                              <button
                                onClick={() => removeActivity(stop.id, act.id)}
                                style={{
                                  flexShrink: 0, background: 'none', border: 'none',
                                  cursor: 'pointer', color: '#cbd5e1',
                                  display: 'flex', alignItems: 'center'
                                }}
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Add Activity Form */}
                    {addingActivity === stop.id ? (
                      <div style={{
                        background: '#f0fdf9', borderRadius: 14, padding: '16px',
                        border: '1px solid #99f6e4'
                      }}>
                        <div style={{ fontSize: 12, fontWeight: 800, color: '#0f766e', marginBottom: 12 }}>
                          ➕ New Activity in {cityName}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                          <input
                            value={newAct.name}
                            onChange={e => setNewAct(a => ({ ...a, name: e.target.value }))}
                            placeholder="Activity name (e.g. Eiffel Tower visit)"
                            style={{
                              background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 10,
                              padding: '9px 12px', fontSize: 12, outline: 'none', fontFamily: 'Inter, sans-serif', color: '#0f172a'
                            }}
                          />
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                            <select
                              value={newAct.category}
                              onChange={e => setNewAct(a => ({ ...a, category: e.target.value }))}
                              style={{
                                background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 10,
                                padding: '8px 10px', fontSize: 11, outline: 'none', fontFamily: 'Inter, sans-serif', color: '#0f172a'
                              }}
                            >
                              {ACTIVITY_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                            </select>
                            <input
                              value={newAct.time}
                              onChange={e => setNewAct(a => ({ ...a, time: e.target.value }))}
                              placeholder="Time (9:00 AM)"
                              style={{
                                background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 10,
                                padding: '8px 10px', fontSize: 11, outline: 'none', fontFamily: 'Inter, sans-serif', color: '#0f172a'
                              }}
                            />
                            <input
                              value={newAct.duration}
                              onChange={e => setNewAct(a => ({ ...a, duration: e.target.value }))}
                              placeholder="Duration (2h)"
                              style={{
                                background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 10,
                                padding: '8px 10px', fontSize: 11, outline: 'none', fontFamily: 'Inter, sans-serif', color: '#0f172a'
                              }}
                            />
                            <input
                              type="number"
                              value={newAct.cost}
                              onChange={e => setNewAct(a => ({ ...a, cost: e.target.value }))}
                              placeholder="Cost $"
                              style={{
                                background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 10,
                                padding: '8px 10px', fontSize: 11, outline: 'none', fontFamily: 'Inter, sans-serif', color: '#0f172a'
                              }}
                            />
                          </div>
                          <input
                            value={newAct.notes}
                            onChange={e => setNewAct(a => ({ ...a, notes: e.target.value }))}
                            placeholder="Notes or tips (optional)"
                            style={{
                              background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 10,
                              padding: '9px 12px', fontSize: 12, outline: 'none', fontFamily: 'Inter, sans-serif', color: '#0f172a'
                            }}
                          />
                          <div style={{ display: 'flex', gap: 8 }}>
                            <button onClick={() => addActivity(stop.id)} style={{
                              flex: 1, background: 'linear-gradient(135deg, #0d9488, #10b981)',
                              color: 'white', border: 'none', borderRadius: 10,
                              padding: '9px', fontSize: 12, fontWeight: 700, cursor: 'pointer'
                            }}>
                              Add Activity
                            </button>
                            <button onClick={() => setAddingActivity(null)} style={{
                              padding: '9px 14px', borderRadius: 10,
                              border: '1.5px solid #e2e8f0', background: 'white',
                              fontSize: 12, fontWeight: 700, color: '#64748b', cursor: 'pointer'
                            }}>
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => { setAddingActivity(stop.id); }}
                        style={{
                          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                          background: 'transparent', border: '1.5px dashed #99f6e4',
                          borderRadius: 12, padding: '11px', fontSize: 12, fontWeight: 700,
                          color: '#0d9488', cursor: 'pointer'
                        }}
                      >
                        <Plus size={13} /> Add Activity to {cityName}
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
