import React from 'react';
import { MapPin, Calendar, Clock, DollarSign, ArrowRight, Share2, Download } from 'lucide-react';

const CAT_EMOJIS = {
  Sightseeing: '🎯', Food: '🍽️', Adventure: '⛺', Culture: '🏛️',
  Shopping: '🛍️', Relaxation: '🧘', Nightlife: '🎉', Transport: '🚌'
};

export default function ItineraryView({ currentTrip, onShareTrip }) {
  if (!currentTrip) {
    return (
      <div style={{ background: 'white', borderRadius: 20, padding: '60px', textAlign: 'center', border: '1.5px dashed #e2e8f0' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#374151' }}>No trip selected</div>
      </div>
    );
  }

  const stops = currentTrip.stops || [];
  const start = new Date(currentTrip.startDate);
  const end = new Date(currentTrip.endDate);
  const days = isNaN(start) || isNaN(end) ? 7 : Math.max(1, Math.round((end - start) / 86400000));
  const totalActivities = stops.reduce((s, st) => s + (st.activities?.length || 0), 0);
  const totalCost = stops.reduce((s, st) => s + (st.activities || []).reduce((a, act) => a + (act.cost || 0), 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a, #134e4a)',
        borderRadius: 24, padding: '32px 36px', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: -50, right: -50, width: 180, height: 180,
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.15), transparent)',
          pointerEvents: 'none'
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', marginBottom: 6 }}>
                FULL ITINERARY
              </div>
              <h1 style={{ fontSize: 26, fontWeight: 900, color: 'white', margin: 0, letterSpacing: '-0.5px' }}>
                {currentTrip.name}
              </h1>
              {currentTrip.description && (
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', margin: '8px 0 0', maxWidth: 480 }}>
                  {currentTrip.description}
                </p>
              )}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => onShareTrip(currentTrip)} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)',
                color: 'white', borderRadius: 10, padding: '9px 16px',
                fontSize: 12, fontWeight: 700, cursor: 'pointer'
              }}>
                <Share2 size={13} /> Share
              </button>
            </div>
          </div>

          {/* Trip meta */}
          <div style={{ display: 'flex', gap: 20, marginTop: 16, flexWrap: 'wrap' }}>
            {[
              { icon: MapPin, label: `${stops.length} cities` },
              { icon: Calendar, label: `${days} days` },
              { icon: Clock, label: `${totalActivities} activities` },
              { icon: DollarSign, label: `$${totalCost.toLocaleString()} planned` },
            ].map(({ icon: Icon, label }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Icon size={13} color="rgba(255,255,255,0.4)" />
                <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.6)' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Route Overview */}
      {stops.length > 0 && (
        <div style={{ background: 'white', borderRadius: 16, padding: '18px 22px', border: '1.5px solid #e8f0ef' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.08em', marginBottom: 12 }}>ROUTE OVERVIEW</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            {stops.map((stop, i) => (
              <React.Fragment key={stop.id || i}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  background: '#f0fdf9', border: '1px solid #99f6e4',
                  borderRadius: 10, padding: '6px 12px'
                }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #0d9488, #10b981)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 9, fontWeight: 900, color: 'white'
                  }}>{i + 1}</div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#0f766e' }}>
                    {stop.city?.name || stop.city || 'City'}
                  </span>
                </div>
                {i < stops.length - 1 && <ArrowRight size={14} color="#94a3b8" />}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* Stops & Activities */}
      {stops.map((stop, idx) => {
        const cityName = stop.city?.name || stop.city || 'City';
        const activities = stop.activities || [];
        const stopCost = activities.reduce((s, a) => s + (a.cost || 0), 0);

        return (
          <div key={stop.id || idx} style={{
            background: 'white', borderRadius: 20,
            border: '1.5px solid #e8f0ef', overflow: 'hidden'
          }}>
            {/* City Header */}
            <div style={{
              background: 'linear-gradient(135deg, #f0fdf9, #ffffff)',
              padding: '18px 22px', borderBottom: '1px solid #e8f0ef',
              display: 'flex', alignItems: 'center', gap: 14
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: 'linear-gradient(135deg, #0d9488, #10b981)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, fontWeight: 900, color: 'white', flexShrink: 0
              }}>
                {idx + 1}
              </div>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 900, color: '#0f172a', margin: 0 }}>📍 {cityName}</h3>
                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
                  {activities.length} activities · ${stopCost.toLocaleString()} estimated
                </div>
              </div>
            </div>

            {/* Activities */}
            <div style={{ padding: '16px 22px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {activities.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px', color: '#94a3b8', fontSize: 12 }}>
                  No activities planned for {cityName} yet
                </div>
              ) : (
                activities.map((act, aIdx) => (
                  <div key={act.id || aIdx} style={{
                    display: 'flex', gap: 14, padding: '12px 16px',
                    background: '#f8fafc', borderRadius: 12
                  }}>
                    {/* Time indicator */}
                    <div style={{
                      width: 40, textAlign: 'center', flexShrink: 0,
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4
                    }}>
                      <div style={{ fontSize: 20 }}>
                        {CAT_EMOJIS[act.category] || '🎯'}
                      </div>
                      {act.time && (
                        <div style={{ fontSize: 9, fontWeight: 700, color: '#0d9488' }}>{act.time}</div>
                      )}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a' }}>{act.name}</div>
                      <div style={{ display: 'flex', gap: 8, marginTop: 4, flexWrap: 'wrap' }}>
                        {act.duration && (
                          <span style={{ fontSize: 10, color: '#64748b', fontWeight: 600 }}>⏱ {act.duration}</span>
                        )}
                        {act.cost > 0 && (
                          <span style={{ fontSize: 10, color: '#0d9488', fontWeight: 700 }}>💰 ${act.cost}</span>
                        )}
                        {act.category && (
                          <span style={{
                            fontSize: 9, fontWeight: 700, color: '#64748b',
                            background: '#f1f5f9', borderRadius: 99, padding: '1px 7px'
                          }}>
                            {act.category}
                          </span>
                        )}
                      </div>
                      {act.notes && (
                        <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 5, lineHeight: 1.5 }}>{act.notes}</div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}

      {stops.length === 0 && (
        <div style={{
          background: 'white', borderRadius: 16, padding: '48px',
          textAlign: 'center', border: '1.5px dashed #e2e8f0'
        }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>📋</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#374151' }}>No stops added yet</div>
          <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>Go to the Builder tab to add cities and activities</div>
        </div>
      )}
    </div>
  );
}
