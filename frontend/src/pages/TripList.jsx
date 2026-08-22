import React, { useState } from 'react';
import { Plus, Trash2, Share2, Eye, MapPin, Calendar, DollarSign, Search, ArrowRight, Globe, Lock } from 'lucide-react';

export default function TripList({ trips, onSelectTrip, onDeleteTrip, onOpenCreateTrip, onShareTrip }) {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filtered = trips.filter(t => {
    const matchSearch = t.name?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filterStatus === 'all' ||
      (filterStatus === 'public' && t.isPublic) ||
      (filterStatus === 'private' && !t.isPublic);
    return matchSearch && matchFilter;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a, #134e4a)',
        borderRadius: 20, padding: '28px 32px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: 16
      }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: 'white', margin: 0, letterSpacing: '-0.5px' }}>My Trips</h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', margin: '4px 0 0' }}>
            {trips.length} trip{trips.length !== 1 ? 's' : ''} planned
          </p>
        </div>
        <button onClick={onOpenCreateTrip} style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'linear-gradient(135deg, #0d9488, #10b981)',
          color: 'white', border: 'none', borderRadius: 12,
          padding: '11px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(13,148,136,0.4)'
        }}>
          <Plus size={15} />
          New Trip
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search trips..."
            style={{
              width: '100%', background: 'white', border: '1.5px solid #e2e8f0',
              borderRadius: 10, padding: '9px 12px 9px 34px',
              fontSize: 13, color: '#0f172a', outline: 'none', fontFamily: 'Inter, sans-serif'
            }}
          />
        </div>

        {['all', 'public', 'private'].map(f => (
          <button key={f} onClick={() => setFilterStatus(f)} style={{
            padding: '8px 16px', borderRadius: 10, fontSize: 12, fontWeight: 700,
            background: filterStatus === f ? 'linear-gradient(135deg, #0d9488, #10b981)' : 'white',
            color: filterStatus === f ? 'white' : '#64748b',
            border: filterStatus === f ? 'none' : '1.5px solid #e2e8f0',
            cursor: 'pointer', textTransform: 'capitalize',
            boxShadow: filterStatus === f ? '0 2px 8px rgba(13,148,136,0.25)' : 'none'
          }}>
            {f === 'all' ? `All (${trips.length})` : f === 'public' ? `🌐 Public` : `🔒 Private`}
          </button>
        ))}
      </div>

      {/* Trip Grid */}
      {filtered.length === 0 ? (
        <div style={{
          background: 'white', borderRadius: 20, padding: '48px',
          textAlign: 'center', border: '1.5px dashed #e2e8f0'
        }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🗺️</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#374151', marginBottom: 6 }}>
            {search ? 'No matching trips' : 'No trips yet'}
          </div>
          <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 20 }}>
            {search ? 'Try a different search term' : 'Create your first adventure!'}
          </div>
          {!search && (
            <button onClick={onOpenCreateTrip} style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'linear-gradient(135deg, #0d9488, #10b981)',
              color: 'white', border: 'none', borderRadius: 12,
              padding: '10px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer'
            }}>
              <Plus size={14} /> Plan a Trip
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {filtered.map((trip) => {
            const start = new Date(trip.startDate);
            const end = new Date(trip.endDate);
            const days = isNaN(start) || isNaN(end) ? 7 : Math.max(1, Math.round((end - start) / 86400000));
            const cities = trip.stops?.map(s => s.city?.name || s.city).filter(Boolean) || [];
            const activities = trip.stops?.reduce((s, st) => s + (st.activities?.length || 0), 0) || 0;

            return (
              <div
                key={trip.id}
                style={{
                  background: 'white', borderRadius: 20, overflow: 'hidden',
                  border: '1.5px solid #f1f5f9',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                  transition: 'all 0.2s', display: 'flex', flexDirection: 'column'
                }}
              >
                {/* Card top color bar */}
                <div style={{
                  height: 6,
                  background: trip.isPublic
                    ? 'linear-gradient(90deg, #0d9488, #10b981)'
                    : 'linear-gradient(90deg, #7c3aed, #a855f7)'
                }} />

                <div style={{ padding: '18px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {/* Trip Name + Badge */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                    <div>
                      <h3 style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', margin: 0 }}>{trip.name}</h3>
                      {trip.description && (
                        <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 3, margin: '3px 0 0', lineHeight: 1.5 }}>
                          {trip.description.slice(0, 60)}{trip.description.length > 60 ? '…' : ''}
                        </p>
                      )}
                    </div>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 4,
                      background: trip.isPublic ? '#f0fdf9' : '#faf5ff',
                      border: `1px solid ${trip.isPublic ? '#99f6e4' : '#e9d5ff'}`,
                      borderRadius: 99, padding: '3px 8px', flexShrink: 0
                    }}>
                      {trip.isPublic ? <Globe size={9} color="#0d9488" /> : <Lock size={9} color="#7c3aed" />}
                      <span style={{ fontSize: 9, fontWeight: 700, color: trip.isPublic ? '#0d9488' : '#7c3aed' }}>
                        {trip.isPublic ? 'PUBLIC' : 'PRIVATE'}
                      </span>
                    </div>
                  </div>

                  {/* Cities Route */}
                  {cities.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                      {cities.slice(0, 3).map((city, i) => (
                        <React.Fragment key={i}>
                          <span style={{
                            fontSize: 10, fontWeight: 700, color: '#0f766e',
                            background: '#f0fdf9', border: '1px solid #99f6e4',
                            borderRadius: 6, padding: '2px 7px'
                          }}>
                            📍 {city}
                          </span>
                          {i < Math.min(cities.length, 3) - 1 && (
                            <ArrowRight size={10} color="#94a3b8" />
                          )}
                        </React.Fragment>
                      ))}
                      {cities.length > 3 && (
                        <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600 }}>+{cities.length - 3} more</span>
                      )}
                    </div>
                  )}

                  {/* Trip Meta */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                    {[
                      { icon: Calendar, label: `${days} days` },
                      { icon: DollarSign, label: trip.budgetLimit > 0 ? `$${trip.budgetLimit.toLocaleString()}` : 'No budget' },
                      { icon: MapPin, label: `${activities} activities` },
                    ].map(({ icon: Icon, label }) => (
                      <div key={label} style={{
                        background: '#f8fafc', borderRadius: 8, padding: '7px 8px',
                        display: 'flex', alignItems: 'center', gap: 5
                      }}>
                        <Icon size={11} color="#94a3b8" />
                        <span style={{ fontSize: 10, fontWeight: 600, color: '#64748b' }}>{label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
                    <button onClick={() => onSelectTrip(trip)} style={{
                      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      background: 'linear-gradient(135deg, #0d9488, #10b981)',
                      color: 'white', border: 'none', borderRadius: 10,
                      padding: '9px', fontSize: 12, fontWeight: 700, cursor: 'pointer'
                    }}>
                      <Eye size={13} /> Open
                    </button>
                    <button onClick={() => onShareTrip(trip)} style={{
                      padding: '9px 12px', borderRadius: 10,
                      background: '#f0fdf9', border: '1px solid #99f6e4',
                      color: '#0d9488', cursor: 'pointer', display: 'flex', alignItems: 'center'
                    }}>
                      <Share2 size={13} />
                    </button>
                    <button onClick={() => onDeleteTrip(trip.id)} style={{
                      padding: '9px 12px', borderRadius: 10,
                      background: '#fff5f5', border: '1px solid #fed7d7',
                      color: '#e53e3e', cursor: 'pointer', display: 'flex', alignItems: 'center'
                    }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
