import React, { useState, useEffect } from 'react';
import { Search, Plus, Star, Clock, DollarSign } from 'lucide-react';
import api from '../api/client';

const CATS = ['All', 'Sightseeing', 'Food', 'Adventure', 'Culture', 'Relaxation', 'Shopping'];
const CAT_COLORS = {
  Sightseeing: '#3b82f6', Food: '#f59e0b', Adventure: '#22c55e',
  Culture: '#ec4899', Relaxation: '#06b6d4', Shopping: '#a855f7', Other: '#94a3b8'
};

export default function ActivityExplorer({ onAddActivityToTrip }) {
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('All');
  const [activitiesList, setActivitiesList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchActivities();
  }, [search, cat]);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search.trim()) params.q = search.trim();
      if (cat !== 'All') params.category = cat;
      const res = await api.get('/activities/catalog', { params });
      if (res.data && res.data.activities) {
        setActivitiesList(res.data.activities);
      }
    } catch (err) {
      console.error('Failed to fetch activity catalog:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a, #134e4a)',
        borderRadius: 20, padding: '24px 28px'
      }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: 'white', margin: 0, letterSpacing: '-0.5px' }}>
          🎯 Activity Explorer
        </h1>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', margin: '5px 0 0' }}>
          Discover curated activities · Click to add to your itinerary
        </p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search activities..."
            style={{
              width: '100%', background: 'white', border: '1.5px solid #e2e8f0',
              borderRadius: 10, padding: '9px 12px 9px 34px',
              fontSize: 13, color: '#0f172a', outline: 'none', fontFamily: 'Inter, sans-serif'
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {CATS.map(c => (
            <button key={c} onClick={() => setCat(c)} style={{
              padding: '7px 14px', borderRadius: 99, fontSize: 11, fontWeight: 700,
              background: cat === c ? 'linear-gradient(135deg, #0d9488, #10b981)' : 'white',
              color: cat === c ? 'white' : '#64748b',
              border: cat === c ? 'none' : '1.5px solid #e2e8f0',
              cursor: 'pointer',
              boxShadow: cat === c ? '0 2px 8px rgba(13,148,136,0.25)' : 'none'
            }}>{c}</button>
          ))}
        </div>
      </div>

      {/* Activity Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '48px' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#64748b' }}>Loading activities...</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
          {activitiesList.map((act, i) => {
            const catColor = CAT_COLORS[act.category] || CAT_COLORS.Other;
            const emojiMap = {
              Food: '🍽️',
              Adventure: '⛺',
              Culture: '🏛️',
              Shopping: '🛍️',
              Relaxation: '🧘',
              Sightseeing: '🗼'
            };
            const actEmoji = emojiMap[act.category] || '🎯';
            const durationStr = act.duration ? `${act.duration}m` : 'Flexible';

            return (
              <div key={i} style={{
                background: 'white', borderRadius: 16, border: '1.5px solid #f1f5f9',
                overflow: 'hidden', display: 'flex', flexDirection: 'column',
                boxShadow: '0 1px 6px rgba(0,0,0,0.04)'
              }}>
                {/* Top */}
                <div style={{
                  background: catColor + '15',
                  padding: '18px 16px', display: 'flex', alignItems: 'flex-start', gap: 12
                }}>
                  <div style={{ fontSize: 28, lineHeight: 1 }}>{actEmoji}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', lineHeight: 1.3 }}>{act.name}</div>
                    <div style={{ fontSize: 11, color: '#64748b', marginTop: 4, lineHeight: 1.4 }}>{act.description}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 3, flexShrink: 0 }}>
                    <Star size={10} color="#f59e0b" fill="#f59e0b" />
                    <span style={{ fontSize: 10, fontWeight: 800, color: '#0f172a' }}>4.8</span>
                  </div>
                </div>

                {/* Details */}
                <div style={{ padding: '12px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={11} color="#94a3b8" />
                      <span style={{ fontSize: 10, fontWeight: 700, color: '#64748b' }}>{durationStr}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <DollarSign size={11} color="#94a3b8" />
                      <span style={{ fontSize: 10, fontWeight: 700, color: '#64748b' }}>
                        {act.cost === 0 ? 'Free' : `$${act.cost}`}
                      </span>
                    </div>
                    <span style={{
                      fontSize: 9, fontWeight: 700, color: catColor,
                      background: catColor + '15', borderRadius: 99, padding: '2px 7px'
                    }}>
                      {act.category}
                    </span>
                  </div>

                  <button
                    onClick={() => onAddActivityToTrip(act)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      background: 'linear-gradient(135deg, #0d9488, #10b981)',
                      color: 'white', border: 'none', borderRadius: 10,
                      padding: '8px', fontSize: 11, fontWeight: 700, cursor: 'pointer',
                      marginTop: 'auto'
                    }}
                  >
                    <Plus size={12} /> Add to Itinerary
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && activitiesList.length === 0 && (
        <div style={{ textAlign: 'center', padding: '48px', background: 'white', borderRadius: 16, border: '1.5px dashed #e2e8f0' }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🔍</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#374151' }}>No activities found</div>
        </div>
      )}
    </div>
  );
}
