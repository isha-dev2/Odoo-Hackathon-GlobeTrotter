import React, { useState } from 'react';
import { MapPin, Calendar, DollarSign, Users, TrendingUp, Star, Plus, ArrowRight, Compass, Sparkles, Globe, Clock, Plane } from 'lucide-react';

const FEATURED_DESTINATIONS = [
  { name: 'Santorini', country: 'Greece', emoji: '🇬🇷', tag: 'Romantic', color: '#dbeafe', textColor: '#1e40af', rating: 4.9 },
  { name: 'Kyoto', country: 'Japan', emoji: '🇯🇵', tag: 'Cultural', color: '#fce7f3', textColor: '#9d174d', rating: 4.8 },
  { name: 'Bali', country: 'Indonesia', emoji: '🇮🇩', tag: 'Adventure', color: '#dcfce7', textColor: '#166534', rating: 4.7 },
  { name: 'Paris', country: 'France', emoji: '🇫🇷', tag: 'Luxury', color: '#fef3c7', textColor: '#92400e', rating: 4.9 },
  { name: 'Maldives', country: 'Maldives', emoji: '🇲🇻', tag: 'Beach', color: '#cffafe', textColor: '#164e63', rating: 5.0 },
  { name: 'Machu Picchu', country: 'Peru', emoji: '🇵🇪', tag: 'Heritage', color: '#ede9fe', textColor: '#5b21b6', rating: 4.8 },
];

const QUICK_STATS = [
  { label: 'Destinations', value: '2,400+', icon: Globe, bg: '#f0fdf9', iconBg: '#0d9488', iconColor: 'white' },
  { label: 'Trips Planned', value: '48K+', icon: Plane, bg: '#faf5ff', iconBg: '#7c3aed', iconColor: 'white' },
  { label: 'Happy Travelers', value: '12K+', icon: Users, bg: '#fff7ed', iconBg: '#f59e0b', iconColor: 'white' },
  { label: 'Avg. Savings', value: '34%', icon: TrendingUp, bg: '#eff6ff', iconBg: '#2563eb', iconColor: 'white' },
];

export default function Dashboard({ trips, selectedTrip, onSelectTrip, onOpenCreateTrip, onToggleAiAgent, onExploreCity, currencySymbol }) {
  const totalBudget = trips.reduce((s, t) => s + (t.budgetLimit || 0), 0);
  const avgDays = trips.length
    ? Math.round(trips.reduce((s, t) => {
        const start = new Date(t.startDate), end = new Date(t.endDate);
        return s + (isNaN(start) || isNaN(end) ? 7 : Math.max(1, Math.round((end - start) / 86400000)));
      }, 0) / trips.length)
    : 7;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28, paddingTop: 8 }}>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #134e4a 50%, #065f46 100%)',
        borderRadius: 24, padding: '44px 48px',
        position: 'relative', overflow: 'hidden',
        minHeight: 220
      }}>
        {/* Decorative orbs */}
        <div style={{
          position: 'absolute', top: -60, right: -60,
          width: 220, height: 220, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16,185,129,0.2), transparent)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', bottom: -40, right: '30%',
          width: 140, height: 140, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245,158,11,0.15), transparent)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', top: 30, right: 180,
          width: 80, height: 80, borderRadius: '50%',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          pointerEvents: 'none'
        }} />

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 20 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.3)',
                borderRadius: 99, padding: '4px 12px'
              }}>
                <Sparkles size={11} color="#34d399" />
                <span style={{ fontSize: 11, fontWeight: 700, color: '#34d399', letterSpacing: '0.05em' }}>AI-POWERED PLANNING</span>
              </div>
            </div>
            <h1 style={{ fontSize: 38, fontWeight: 900, color: 'white', lineHeight: 1.15, letterSpacing: '-1px', margin: 0 }}>
              Plan Your Perfect<br />
              <span style={{ background: 'linear-gradient(90deg, #34d399, #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                World Journey
              </span>
            </h1>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', marginTop: 10, margin: '10px 0 0' }}>
              {trips.length} active trips · {totalBudget > 0 ? `${currencySymbol}${totalBudget.toLocaleString()} planned budget` : 'Start planning today'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button onClick={onToggleAiAgent} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
              color: 'white', border: 'none', borderRadius: 12,
              padding: '11px 20px', fontSize: 13, fontWeight: 700,
              cursor: 'pointer', boxShadow: '0 4px 16px rgba(124,58,237,0.4)',
              transition: 'all 0.2s'
            }}>
              <Sparkles size={15} />
              AI Trip Planner
            </button>
            <button onClick={onOpenCreateTrip} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)',
              color: 'white', border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 12, padding: '11px 20px', fontSize: 13, fontWeight: 700,
              cursor: 'pointer', transition: 'all 0.2s'
            }}>
              <Plus size={15} />
              New Trip
            </button>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {QUICK_STATS.map(({ label, value, icon: Icon, bg, iconBg, iconColor }) => (
          <div key={label} style={{
            background: bg, borderRadius: 16, padding: '18px 20px',
            display: 'flex', alignItems: 'center', gap: 14,
            border: '1px solid rgba(0,0,0,0.04)'
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, boxShadow: `0 4px 12px ${iconBg}50`
            }}>
              <Icon size={20} color={iconColor} strokeWidth={2} />
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.5px' }}>{value}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', letterSpacing: '0.02em' }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area: My Trips + Discover */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 20 }}>
        {/* My Trips */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: 0 }}>My Trips</h2>
            {trips.length > 0 && (
              <span style={{
                fontSize: 11, fontWeight: 700, color: '#0d9488',
                background: '#f0fdf9', border: '1px solid #99f6e4',
                borderRadius: 99, padding: '3px 10px'
              }}>
                {trips.length} active
              </span>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {trips.length === 0 && (
              <div style={{
                background: 'white', borderRadius: 16, padding: '32px 20px',
                border: '1.5px dashed #e2e8f0', textAlign: 'center'
              }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>✈️</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#374151', marginBottom: 6 }}>No trips yet</div>
                <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 16 }}>Create your first adventure!</div>
                <button onClick={onOpenCreateTrip} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: 'linear-gradient(135deg, #0d9488, #10b981)',
                  color: 'white', border: 'none', borderRadius: 10,
                  padding: '9px 18px', fontSize: 12, fontWeight: 700, cursor: 'pointer'
                }}>
                  <Plus size={13} /> Plan a Trip
                </button>
              </div>
            )}

            {trips.slice(0, 4).map((trip) => {
              const isSelected = selectedTrip?.id === trip.id;
              const start = new Date(trip.startDate);
              const end = new Date(trip.endDate);
              const days = isNaN(start) || isNaN(end) ? 7 : Math.max(1, Math.round((end - start) / 86400000));
              const cities = trip.stops?.map(s => s.city?.name || s.city || 'City').filter(Boolean) || [];

              return (
                <button
                  key={trip.id}
                  onClick={() => onSelectTrip(trip)}
                  style={{
                    background: isSelected ? 'linear-gradient(135deg, #f0fdf9, #fff)' : 'white',
                    border: isSelected ? '2px solid #0d9488' : '1.5px solid #f1f5f9',
                    borderRadius: 16, padding: '14px 16px',
                    display: 'flex', alignItems: 'flex-start', gap: 14,
                    cursor: 'pointer', textAlign: 'left',
                    transition: 'all 0.15s', width: '100%',
                    boxShadow: isSelected ? '0 4px 16px rgba(13,148,136,0.1)' : '0 1px 4px rgba(0,0,0,0.04)'
                  }}
                >
                  {/* Color dot / emoji */}
                  <div style={{
                    width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                    background: isSelected
                      ? 'linear-gradient(135deg, #0d9488, #10b981)'
                      : 'linear-gradient(135deg, #f1f5f9, #e2e8f0)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 18
                  }}>
                    {trip.coverPhoto && trip.coverPhoto.length === 2 ? trip.coverPhoto : '🗺️'}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: 13, fontWeight: 800, color: '#0f172a',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                    }}>
                      {trip.name}
                    </div>
                    <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
                      {cities.length > 0 ? cities.slice(0, 2).join(' → ') : 'No cities yet'}{cities.length > 2 ? ` +${cities.length - 2}` : ''}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6 }}>
                      <span style={{ fontSize: 10, color: '#64748b', fontWeight: 600 }}>
                        📅 {days} days
                      </span>
                      {trip.budgetLimit > 0 && (
                        <span style={{ fontSize: 10, color: '#64748b', fontWeight: 600 }}>
                          💰 {currencySymbol}{trip.budgetLimit.toLocaleString()}
                        </span>
                      )}
                      {trip.isPublic && (
                        <span style={{
                          fontSize: 9, fontWeight: 700, color: '#0d9488',
                          background: '#f0fdf9', border: '1px solid #99f6e4',
                          borderRadius: 99, padding: '1px 7px'
                        }}>PUBLIC</span>
                      )}
                    </div>
                  </div>

                  {isSelected && (
                    <div style={{ flexShrink: 0, width: 7, height: 7, borderRadius: '50%', background: '#0d9488', alignSelf: 'center' }} />
                  )}
                </button>
              );
            })}

            {trips.length > 4 && (
              <div style={{ textAlign: 'center', paddingTop: 4 }}>
                <button style={{
                  fontSize: 12, fontWeight: 700, color: '#0d9488',
                  background: 'none', border: 'none', cursor: 'pointer'
                }}>
                  View all {trips.length} trips →
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Popular Destinations + Trip Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Selected Trip Overview */}
          {selectedTrip && (
            <div style={{
              background: 'white', borderRadius: 20, padding: '20px 22px',
              border: '1.5px solid #e8f0ef',
              boxShadow: '0 2px 12px rgba(0,0,0,0.04)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <h3 style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  📌 {selectedTrip.name}
                </h3>
                <span style={{
                  fontSize: 10, fontWeight: 700,
                  background: selectedTrip.isPublic ? '#f0fdf9' : '#f8fafc',
                  color: selectedTrip.isPublic ? '#0d9488' : '#94a3b8',
                  border: `1px solid ${selectedTrip.isPublic ? '#99f6e4' : '#e2e8f0'}`,
                  borderRadius: 99, padding: '3px 10px'
                }}>
                  {selectedTrip.isPublic ? '🌐 Public' : '🔒 Private'}
                </span>
              </div>

              {/* Stop Cities */}
              {selectedTrip.stops && selectedTrip.stops.length > 0 && (
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.08em', marginBottom: 8 }}>ROUTE</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                    {selectedTrip.stops.map((stop, i) => (
                      <React.Fragment key={stop.id || i}>
                        <div style={{
                          background: '#f0fdf9', border: '1px solid #99f6e4',
                          borderRadius: 8, padding: '4px 10px',
                          fontSize: 11, fontWeight: 700, color: '#0f766e'
                        }}>
                          <MapPin size={9} style={{ marginRight: 3, display: 'inline' }} />
                          {stop.city?.name || stop.city || 'City'}
                        </div>
                        {i < selectedTrip.stops.length - 1 && (
                          <ArrowRight size={12} color="#94a3b8" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}

              {/* Trip stats row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                {[
                  {
                    label: 'Duration',
                    icon: Clock,
                    value: (() => {
                      const s = new Date(selectedTrip.startDate), e = new Date(selectedTrip.endDate);
                      return isNaN(s) || isNaN(e) ? '7 days' : `${Math.max(1, Math.round((e - s) / 86400000))} days`;
                    })()
                  },
                  { label: 'Budget', icon: DollarSign, value: selectedTrip.budgetLimit > 0 ? `$${selectedTrip.budgetLimit.toLocaleString()}` : 'Not set' },
                  { label: 'Activities', icon: Compass, value: `${selectedTrip.stops?.reduce((s, st) => s + (st.activities?.length || 0), 0) || 0} planned` },
                ].map(({ label, icon: Icon, value }) => (
                  <div key={label} style={{
                    background: '#f8fafc', borderRadius: 12, padding: '10px 12px'
                  }}>
                    <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600, marginBottom: 4 }}>{label}</div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a' }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Popular Destinations */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: 0 }}>Discover</h2>
              <button onClick={onExploreCity} style={{
                display: 'flex', alignItems: 'center', gap: 4,
                fontSize: 12, fontWeight: 700, color: '#0d9488',
                background: 'none', border: 'none', cursor: 'pointer'
              }}>
                See all <ArrowRight size={13} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {FEATURED_DESTINATIONS.map((dest) => (
                <button
                  key={dest.name}
                  onClick={onExploreCity}
                  style={{
                    background: dest.color, borderRadius: 14, padding: '14px 14px',
                    border: 'none', cursor: 'pointer', textAlign: 'left',
                    transition: 'all 0.15s'
                  }}
                >
                  <div style={{ fontSize: 22, marginBottom: 6 }}>{dest.emoji}</div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a' }}>{dest.name}</div>
                  <div style={{ fontSize: 10, color: '#64748b', fontWeight: 500, marginBottom: 6 }}>{dest.country}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{
                      fontSize: 9, fontWeight: 700, color: dest.textColor,
                      background: 'rgba(255,255,255,0.7)', borderRadius: 99, padding: '2px 7px'
                    }}>
                      {dest.tag}
                    </span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#f59e0b' }}>
                      ⭐ {dest.rating}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
