import React, { useState } from 'react';
import {
  Search, Filter, Plus, Clock, DollarSign, Star,
  Compass, Check, Tag, Sparkles, MapPin
} from 'lucide-react';
import { MOCK_ACTIVITIES } from '../api/client';

const CATEGORIES = ['All', 'Sightseeing', 'Food', 'Adventure', 'Culture', 'Nightlife'];

export default function ActivityExplorer({ onAddActivityToTrip, currencySymbol = '₹' }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [maxPrice, setMaxPrice] = useState(10000);
  const [addedId, setAddedId] = useState(null);

  const filtered = MOCK_ACTIVITIES.filter(a => {
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.city.toLowerCase().includes(search.toLowerCase()) ||
      a.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || a.category === category;
    const matchPrice = a.cost <= maxPrice;
    return matchSearch && matchCat && matchPrice;
  });

  const handleAdd = (act) => {
    onAddActivityToTrip(act);
    setAddedId(act.id);
    setTimeout(() => setAddedId(null), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #042f2e 0%, #064e3b 40%, #0f172a 100%)',
        borderRadius: '24px', padding: '36px 40px',
        position: 'relative', overflow: 'hidden',
        boxShadow: '0 12px 36px -8px rgba(4, 47, 46, 0.4)',
        border: '1px solid rgba(16, 185, 129, 0.2)'
      }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.35)', borderRadius: '99px', padding: '4px 12px', marginBottom: '10px' }}>
            <Compass size={12} color="#34d399" />
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#6ee7b7', letterSpacing: '0.05em' }}>
              CURATED GLOBAL & INDIAN EXPERIENCES
            </span>
          </div>

          <h1 style={{ fontSize: '32px', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.5px', margin: 0 }}>
            Activity & Tour Explorer ({MOCK_ACTIVITIES.length})
          </h1>

          <p style={{ fontSize: '14px', color: '#cbd5e1', marginTop: '8px', maxWidth: '600px' }}>
            Browse royal fort safaris, Kerala houseboat cruises, Himalayan paragliding, or global experiences to enrich your itinerary.
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div style={{
        background: '#ffffff', borderRadius: '20px', padding: '18px 24px',
        border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
        display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between'
      }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search fort safaris, houseboats, paragliding, ramen, food tours..."
            style={{
              width: '100%', background: '#f8fafc', border: '1.5px solid #cbd5e1',
              borderRadius: '12px', padding: '10px 14px 10px 40px',
              fontSize: '13px', fontWeight: 600, color: '#0f172a', outline: 'none'
            }}
          />
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {CATEGORIES.map(c => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              style={{
                padding: '8px 14px', borderRadius: '10px',
                fontSize: '12px', fontWeight: 800,
                background: category === c ? 'linear-gradient(135deg, #0d9488 0%, #10b981 100%)' : '#f8fafc',
                color: category === c ? '#ffffff' : '#475569',
                border: category === c ? 'none' : '1px solid #cbd5e1',
                cursor: 'pointer', boxShadow: category === c ? '0 2px 8px rgba(13,148,136,0.3)' : 'none'
              }}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Price Slider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc', padding: '6px 12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b' }}>Max {currencySymbol}{maxPrice.toLocaleString()}</span>
          <input
            type="range"
            min="500"
            max="15000"
            step="500"
            value={maxPrice}
            onChange={e => setMaxPrice(Number(e.target.value))}
            style={{ cursor: 'pointer', width: '100px' }}
          />
        </div>
      </div>

      {/* Activities Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {filtered.map(act => {
          const isAdded = addedId === act.id;

          return (
            <div
              key={act.id}
              style={{
                background: '#ffffff', borderRadius: '24px',
                border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                overflow: 'hidden', display: 'flex', flexDirection: 'column',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}
            >
              {/* Photo Thumbnail */}
              <div style={{ height: '180px', position: 'relative', overflow: 'hidden' }}>
                <img
                  src={act.imageUrl}
                  alt={act.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />

                <div style={{
                  position: 'absolute', top: '14px', left: '14px',
                  background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(8px)',
                  color: '#ffffff', borderRadius: '99px', padding: '4px 12px',
                  fontSize: '12px', fontWeight: 800
                }}>
                  📍 {act.city}, {act.country}
                </div>

                <div style={{
                  position: 'absolute', bottom: '14px', right: '14px',
                  background: 'linear-gradient(135deg, #0d9488, #10b981)', color: '#ffffff',
                  borderRadius: '10px', padding: '4px 12px',
                  fontSize: '14px', fontWeight: 900, boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                }}>
                  {currencySymbol}{act.cost.toLocaleString()}
                </div>
              </div>

              {/* Body */}
              <div style={{ padding: '22px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#0d9488', background: '#f0fdf9', padding: '2px 8px', borderRadius: '6px', border: '1px solid #a7f3d0' }}>
                      {act.category}
                    </span>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 800, color: '#0f172a' }}>
                      <Star size={13} color="#f59e0b" fill="#f59e0b" />
                      <span>{act.rating} ({act.reviews})</span>
                    </div>
                  </div>

                  <h3 style={{ fontSize: '17px', fontWeight: 900, color: '#0f172a', margin: '0 0 8px', lineHeight: 1.3 }}>
                    {act.name}
                  </h3>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#64748b', fontWeight: 600, marginBottom: '12px' }}>
                    <Clock size={14} color="#0d9488" />
                    <span>Duration: {Math.round(act.duration / 60)} hours</span>
                  </div>

                  <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5, margin: '0 0 16px' }}>
                    {act.description}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleAdd(act)}
                  style={{
                    width: '100%', padding: '12px', borderRadius: '14px',
                    background: isAdded ? '#10b981' : 'linear-gradient(135deg, #0d9488 0%, #10b981 100%)',
                    color: '#ffffff', border: 'none',
                    fontSize: '13px', fontWeight: 800, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    boxShadow: '0 4px 14px rgba(13,148,136,0.3)'
                  }}
                >
                  {isAdded ? (
                    <>
                      <Check size={16} strokeWidth={3} />
                      <span>Added to Trip Stop!</span>
                    </>
                  ) : (
                    <>
                      <Plus size={16} strokeWidth={2.5} />
                      <span>Add to Itinerary Stop</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
