import React, { useState } from 'react';
import {
  MapPin, Calendar, Clock, DollarSign, ArrowRight, Share2, Download,
  CheckCircle, CheckCircle2, Circle, Navigation, Printer, Plane, Train,
  Car, Sparkles, ExternalLink, Tag
} from 'lucide-react';

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

export default function ItineraryView({
  currentTrip,
  onShareTrip,
  onNavigateToBuilder,
  currencySymbol = '$',
  onExportTrip
}) {
  const [completedActs, setCompletedActs] = useState({});

  if (!currentTrip) {
    return (
      <div style={{
        background: '#ffffff', borderRadius: '24px', padding: '60px 24px',
        textAlign: 'center', border: '2px dashed #cbd5e1'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🗺️</div>
        <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a' }}>No Trip Selected</h2>
        <p style={{ fontSize: '14px', color: '#64748b', marginTop: '6px' }}>
          Please choose a trip from the dashboard or create a new trip to view the itinerary.
        </p>
      </div>
    );
  }

  const stops = currentTrip.stops || [];
  const start = new Date(currentTrip.startDate);
  const end = new Date(currentTrip.endDate);
  const daysCount = isNaN(start) || isNaN(end) ? 7 : Math.max(1, Math.round((end - start) / 86400000));
  const totalActivities = stops.reduce((s, st) => s + (st.activities?.length || 0), 0);
  const totalCost = stops.reduce((s, st) => s + (st.activities || []).reduce((a, act) => a + (act.cost || 0), 0), 0);

  const toggleComplete = (actId) => {
    setCompletedActs(prev => ({ ...prev, [actId]: !prev[actId] }));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* 1. Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #042f2e 0%, #064e3b 40%, #0f172a 100%)',
        borderRadius: '24px', padding: '36px 40px',
        position: 'relative', overflow: 'hidden',
        boxShadow: '0 12px 36px -8px rgba(4, 47, 46, 0.4)',
        border: '1px solid rgba(16, 185, 129, 0.2)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: '680px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.35)', borderRadius: '99px', padding: '4px 12px', marginBottom: '12px' }}>
              <Sparkles size={12} color="#34d399" />
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#6ee7b7', letterSpacing: '0.05em' }}>
                COMPLETE DAY-BY-DAY MASTER ITINERARY
              </span>
            </div>

            <h1 style={{ fontSize: '32px', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.5px', margin: 0, lineHeight: 1.2 }}>
              {currentTrip.name}
            </h1>

            {currentTrip.description && (
              <p style={{ fontSize: '14px', color: '#cbd5e1', margin: '10px 0 0', lineHeight: 1.6 }}>
                {currentTrip.description}
              </p>
            )}

            {/* Quick Metrics */}
            <div style={{ display: 'flex', gap: '20px', marginTop: '20px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#e2e8f0', fontSize: '13px', fontWeight: 700 }}>
                <MapPin size={16} color="#34d399" />
                <span>{stops.length} Cities</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#e2e8f0', fontSize: '13px', fontWeight: 700 }}>
                <Calendar size={16} color="#34d399" />
                <span>{daysCount} Days ({currentTrip.startDate} → {currentTrip.endDate})</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#e2e8f0', fontSize: '13px', fontWeight: 700 }}>
                <Clock size={16} color="#34d399" />
                <span>{totalActivities} Experiences</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6ee7b7', fontSize: '13px', fontWeight: 900 }}>
                <DollarSign size={16} color="#34d399" />
                <span>{currencySymbol}{totalCost.toLocaleString()} Estimated</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={() => onShareTrip(currentTrip)}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)',
                color: '#ffffff', borderRadius: '12px', padding: '10px 18px',
                fontSize: '13px', fontWeight: 800, cursor: 'pointer', backdropFilter: 'blur(8px)'
              }}
            >
              <Share2 size={15} />
              <span>Share Itinerary</span>
            </button>

            <button
              onClick={onExportTrip}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)',
                color: '#ffffff', borderRadius: '12px', padding: '10px 18px',
                fontSize: '13px', fontWeight: 800, cursor: 'pointer', backdropFilter: 'blur(8px)'
              }}
            >
              <Download size={15} />
              <span>Export JSON</span>
            </button>

            <button
              onClick={handlePrint}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                background: '#ffffff', color: '#0f172a', border: 'none',
                borderRadius: '12px', padding: '10px 18px',
                fontSize: '13px', fontWeight: 800, cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(0,0,0,0.15)'
              }}
            >
              <Printer size={15} />
              <span>Print PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Route Connection Visualizer */}
      {stops.length > 0 && (
        <div style={{
          background: '#ffffff', borderRadius: '20px', padding: '22px 28px',
          border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
        }}>
          <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '14px' }}>
            ROUTE SEQUENCE & CITY STOPS
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {stops.map((stop, i) => {
              const cityName = stop.city?.name || stop.city || 'City';
              return (
                <React.Fragment key={stop.id || i}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    background: '#f0fdf9', border: '1.5px solid #a7f3d0',
                    borderRadius: '14px', padding: '10px 16px',
                    boxShadow: '0 2px 6px rgba(13,148,136,0.08)'
                  }}>
                    <div style={{
                      width: '26px', height: '26px', borderRadius: '50%',
                      background: 'linear-gradient(135deg, #0d9488, #10b981)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '12px', fontWeight: 900, color: '#ffffff'
                    }}>
                      {i + 1}
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 900, color: '#0f766e' }}>
                        {cityName}
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>
                        {stop.activities?.length || 0} scheduled acts
                      </div>
                    </div>
                  </div>

                  {i < stops.length - 1 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#0d9488' }}>
                      <ArrowRight size={18} strokeWidth={2.5} />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Detailed Stops & Daily Activity Timelines */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {stops.map((stop, idx) => {
          const cityName = stop.city?.name || stop.city || 'City';
          const countryName = stop.city?.country || 'International';
          const activities = stop.activities || [];
          const stopTotal = activities.reduce((s, a) => s + (a.cost || 0), 0);

          return (
            <div
              key={stop.id || idx}
              style={{
                background: '#ffffff',
                borderRadius: '24px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                overflow: 'hidden'
              }}
            >
              {/* City Stop Header Bar */}
              <div style={{
                background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                padding: '20px 28px',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '46px', height: '46px', borderRadius: '14px',
                    background: 'linear-gradient(135deg, #0d9488 0%, #10b981 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '18px', fontWeight: 900, color: '#ffffff',
                    boxShadow: '0 4px 12px rgba(13,148,136,0.3)'
                  }}>
                    {idx + 1}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                        {cityName}
                      </h3>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', background: '#ffffff', border: '1px solid #cbd5e1', padding: '2px 8px', borderRadius: '6px' }}>
                        {countryName}
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px', fontWeight: 600 }}>
                      Stop Duration: {stop.startDate || 'Day 1'} to {stop.endDate || 'Day 3'} · {activities.length} planned experiences
                    </div>
                  </div>
                </div>

                <div style={{
                  background: '#ffffff', border: '1.5px solid #a7f3d0',
                  borderRadius: '12px', padding: '8px 16px',
                  display: 'flex', alignItems: 'center', gap: '8px'
                }}>
                  <DollarSign size={16} color="#0d9488" />
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#0f766e' }}>
                    {currencySymbol}{stopTotal.toLocaleString()} Stop Total
                  </span>
                </div>
              </div>

              {/* Activity Cards List */}
              <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {activities.length === 0 ? (
                  <div style={{
                    padding: '30px', textAlign: 'center', background: '#f8fafc',
                    borderRadius: '16px', border: '1.5px dashed #cbd5e1'
                  }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#475569' }}>
                      No activities added for {cityName} yet
                    </div>
                    <button
                      onClick={onNavigateToBuilder}
                      style={{
                        marginTop: '10px', background: '#0d9488', color: '#ffffff',
                        border: 'none', borderRadius: '10px', padding: '8px 16px',
                        fontSize: '12px', fontWeight: 800, cursor: 'pointer'
                      }}
                    >
                      + Add Activities in Builder
                    </button>
                  </div>
                ) : (
                  activities.map((act, actIdx) => {
                    const isDone = !!completedActs[act.id || actIdx];
                    const catStyle = CAT_COLORS[act.category] || { bg: '#f1f5f9', text: '#475569', border: '#cbd5e1', emoji: '🎯' };

                    return (
                      <div
                        key={act.id || actIdx}
                        style={{
                          display: 'flex', alignItems: 'flex-start', gap: '16px',
                          padding: '16px 20px',
                          background: isDone ? '#f0fdf4' : '#ffffff',
                          borderRadius: '16px',
                          border: isDone ? '1.5px solid #86efac' : '1px solid #e2e8f0',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {/* Interactive Checkbox */}
                        <button
                          onClick={() => toggleComplete(act.id || actIdx)}
                          style={{
                            background: 'transparent', border: 'none',
                            cursor: 'pointer', padding: '2px', color: isDone ? '#16a34a' : '#94a3b8',
                            flexShrink: 0, marginTop: '2px'
                          }}
                        >
                          {isDone ? <CheckCircle2 size={22} color="#16a34a" /> : <Circle size={22} />}
                        </button>

                        {/* Category Emoji Icon */}
                        <div style={{
                          width: '42px', height: '42px', borderRadius: '12px',
                          background: catStyle.bg, border: `1px solid ${catStyle.border}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '18px', flexShrink: 0
                        }}>
                          {catStyle.emoji}
                        </div>

                        {/* Details */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                            <h4 style={{
                              fontSize: '16px', fontWeight: 800, color: isDone ? '#15803d' : '#0f172a',
                              margin: 0, textDecoration: isDone ? 'line-through' : 'none'
                            }}>
                              {act.name}
                            </h4>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{
                                fontSize: '11px', fontWeight: 800, color: catStyle.text,
                                background: catStyle.bg, border: `1px solid ${catStyle.border}`,
                                borderRadius: '99px', padding: '3px 10px'
                              }}>
                                {act.category || 'Sightseeing'}
                              </span>

                              <span style={{
                                fontSize: '13px', fontWeight: 900, color: '#0d9488',
                                background: '#ecfdf5', borderRadius: '8px', padding: '3px 10px',
                                border: '1px solid #a7f3d0'
                              }}>
                                {currencySymbol}{act.cost || 0}
                              </span>
                            </div>
                          </div>

                          {/* Time & Duration Pill */}
                          <div style={{ display: 'flex', gap: '14px', marginTop: '6px', fontSize: '12px', color: '#64748b', fontWeight: 600 }}>
                            {act.time && (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#0f766e', fontWeight: 700 }}>
                                <Clock size={13} /> {act.time}
                              </span>
                            )}
                            {act.duration && (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                ⏱ Duration: {act.duration}
                              </span>
                            )}
                          </div>

                          {/* Description or Notes */}
                          {(act.description || act.notes) && (
                            <p style={{ fontSize: '13px', color: '#475569', margin: '8px 0 0', lineHeight: 1.5 }}>
                              {act.description || act.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Transit Connector between cities */}
              {idx < stops.length - 1 && (
                <div style={{
                  background: '#f8fafc', padding: '12px 28px', borderTop: '1px solid #e2e8f0',
                  display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: '#64748b', fontWeight: 700
                }}>
                  <Train size={16} color="#0d9488" />
                  <span>Transit connection to {stops[idx + 1].city?.name || stops[idx + 1].city || 'Next Stop'} (Estimated ~2h 30m by High-Speed Rail / Flight)</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}
