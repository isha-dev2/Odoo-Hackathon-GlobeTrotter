import React, { useState } from 'react';
import {
  Plus, Trash2, Share2, Eye, MapPin, Calendar, DollarSign,
  Search, ArrowRight, Globe, Lock, Copy, Sparkles, Filter
} from 'lucide-react';

export default function TripList({
  trips = [],
  onSelectTrip,
  onDeleteTrip,
  onOpenCreateTrip,
  onShareTrip,
  currencySymbol = '$'
}) {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filtered = trips.filter(t => {
    const matchSearch = t.name?.toLowerCase().includes(search.toLowerCase()) ||
      t.description?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filterStatus === 'all' ||
      (filterStatus === 'public' && t.isPublic) ||
      (filterStatus === 'private' && !t.isPublic);
    return matchSearch && matchFilter;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #042f2e 0%, #064e3b 40%, #0f172a 100%)',
        borderRadius: '24px', padding: '36px 40px',
        position: 'relative', overflow: 'hidden',
        boxShadow: '0 12px 36px -8px rgba(4, 47, 46, 0.4)',
        border: '1px solid rgba(16, 185, 129, 0.2)'
      }}>
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.35)', borderRadius: '99px', padding: '4px 12px', marginBottom: '10px' }}>
              <Globe size={12} color="#34d399" />
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#6ee7b7', letterSpacing: '0.05em' }}>
                ITINERARY VAULT & MANAGEMENT
              </span>
            </div>

            <h1 style={{ fontSize: '32px', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.5px', margin: 0 }}>
              My Travel Itineraries ({trips.length})
            </h1>

            <p style={{ fontSize: '14px', color: '#cbd5e1', marginTop: '8px' }}>
              Access, customize, duplicate, or share all your customized travel plans in one dashboard.
            </p>
          </div>

          <button
            onClick={onOpenCreateTrip}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: 'linear-gradient(135deg, #0d9488 0%, #10b981 100%)',
              color: '#ffffff', border: 'none', borderRadius: '12px',
              padding: '12px 22px', fontSize: '13px', fontWeight: 800, cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(13,148,136,0.4)'
            }}
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>Create New Trip</span>
          </button>
        </div>
      </div>

      {/* Filter Controls */}
      <div style={{
        background: '#ffffff', borderRadius: '20px', padding: '18px 24px',
        border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
        display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search trips by title or description..."
            style={{
              width: '100%', background: '#f8fafc', border: '1.5px solid #cbd5e1',
              borderRadius: '12px', padding: '10px 14px 10px 40px',
              fontSize: '13px', fontWeight: 600, color: '#0f172a', outline: 'none'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {[
            { id: 'all', label: `All Trips (${trips.length})` },
            { id: 'public', label: '🌐 Public' },
            { id: 'private', label: '🔒 Private' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilterStatus(f.id)}
              style={{
                padding: '8px 16px', borderRadius: '10px',
                fontSize: '12px', fontWeight: 800,
                background: filterStatus === f.id ? 'linear-gradient(135deg, #0d9488 0%, #10b981 100%)' : '#f8fafc',
                color: filterStatus === f.id ? '#ffffff' : '#475569',
                border: filterStatus === f.id ? 'none' : '1px solid #cbd5e1',
                cursor: 'pointer', boxShadow: filterStatus === f.id ? '0 2px 8px rgba(13,148,136,0.3)' : 'none'
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Trips */}
      {filtered.length === 0 ? (
        <div style={{
          background: '#ffffff', borderRadius: '24px', padding: '60px 24px',
          textAlign: 'center', border: '2px dashed #cbd5e1'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '14px' }}>🗺️</div>
          <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#0f172a' }}>
            {search ? 'No matching itineraries found' : 'No trips created yet'}
          </h3>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
            {search ? 'Try clearing your search query' : 'Start your first personalized travel itinerary now.'}
          </p>
          {!search && (
            <button
              onClick={onOpenCreateTrip}
              style={{
                marginTop: '16px', background: '#0d9488', color: '#ffffff',
                border: 'none', borderRadius: '12px', padding: '10px 20px',
                fontSize: '13px', fontWeight: 800, cursor: 'pointer'
              }}
            >
              Create Trip
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
          {filtered.map(trip => {
            const start = new Date(trip.startDate);
            const end = new Date(trip.endDate);
            const days = isNaN(start) || isNaN(end) ? 7 : Math.max(1, Math.round((end - start) / 86400000));
            const cities = trip.stops?.map(s => s.city?.name || s.city).filter(Boolean) || [];
            const activities = trip.stops?.reduce((s, st) => s + (st.activities?.length || 0), 0) || 0;

            return (
              <div
                key={trip.id}
                style={{
                  background: '#ffffff', borderRadius: '24px',
                  border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                  overflow: 'hidden', display: 'flex', flexDirection: 'column',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
              >
                {/* Cover Thumbnail */}
                <div style={{ height: '160px', position: 'relative', overflow: 'hidden', background: '#0f172a' }}>
                  {trip.coverPhoto && trip.coverPhoto.startsWith('http') ? (
                    <img src={trip.coverPhoto} alt={trip.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0d9488, #10b981)', fontSize: '48px' }}>
                      {trip.coverPhoto || '🗺️'}
                    </div>
                  )}

                  <div style={{
                    position: 'absolute', top: '14px', right: '14px',
                    background: trip.isPublic ? 'rgba(16, 185, 129, 0.9)' : 'rgba(124, 58, 237, 0.9)',
                    backdropFilter: 'blur(8px)', color: '#ffffff',
                    borderRadius: '99px', padding: '4px 10px',
                    fontSize: '10px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px'
                  }}>
                    {trip.isPublic ? <Globe size={11} /> : <Lock size={11} />}
                    <span>{trip.isPublic ? 'PUBLIC' : 'PRIVATE'}</span>
                  </div>
                </div>

                {/* Body */}
                <div style={{ padding: '22px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#0f172a', margin: '0 0 6px' }}>
                      {trip.name}
                    </h3>

                    {trip.description && (
                      <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.5, margin: '0 0 14px' }}>
                        {trip.description.slice(0, 80)}{trip.description.length > 80 ? '…' : ''}
                      </p>
                    )}

                    {/* Route sequence badges */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
                      {cities.slice(0, 3).map((city, idx) => (
                        <React.Fragment key={idx}>
                          <span style={{ fontSize: '11px', fontWeight: 800, color: '#0f766e', background: '#f0fdf9', border: '1px solid #a7f3d0', borderRadius: '6px', padding: '2px 8px' }}>
                            {city}
                          </span>
                          {idx < Math.min(cities.length, 3) - 1 && (
                            <ArrowRight size={12} color="#94a3b8" />
                          )}
                        </React.Fragment>
                      ))}
                      {cities.length > 3 && (
                        <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>+{cities.length - 3}</span>
                      )}
                    </div>

                    {/* Metadata Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', background: '#f8fafc', padding: '10px 12px', borderRadius: '12px', border: '1px solid #f1f5f9', marginBottom: '16px' }}>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>
                        📅 <strong>{days} days</strong>
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>
                        🎯 <strong>{activities} acts</strong>
                      </div>
                      <div style={{ fontSize: '11px', color: '#0d9488', fontWeight: 800 }}>
                        💰 {currencySymbol}{trip.budgetLimit?.toLocaleString() || '1,500'}
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => onSelectTrip(trip)}
                      style={{
                        flex: 1, padding: '11px', borderRadius: '12px',
                        background: 'linear-gradient(135deg, #0d9488 0%, #10b981 100%)',
                        color: '#ffffff', border: 'none',
                        fontSize: '13px', fontWeight: 800, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                        boxShadow: '0 4px 12px rgba(13,148,136,0.3)'
                      }}
                    >
                      <Eye size={15} />
                      <span>Open Workspace</span>
                    </button>

                    <button
                      onClick={() => onShareTrip(trip)}
                      style={{
                        padding: '11px 14px', borderRadius: '12px',
                        background: '#f0fdf9', border: '1.5px solid #a7f3d0',
                        color: '#0d9488', cursor: 'pointer'
                      }}
                      title="Share trip"
                    >
                      <Share2 size={15} />
                    </button>

                    <button
                      onClick={() => onDeleteTrip(trip.id)}
                      style={{
                        padding: '11px 14px', borderRadius: '12px',
                        background: '#fff5f5', border: '1.5px solid #fecaca',
                        color: '#ef4444', cursor: 'pointer'
                      }}
                      title="Delete trip"
                    >
                      <Trash2 size={15} />
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
