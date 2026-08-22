import React, { useState } from 'react';
import {
  X, Calendar, DollarSign, FileText, PlusCircle,
  MapPin, Globe, Lock, Check, Sparkles
} from 'lucide-react';
import api, { MOCK_CITIES } from '../api/client';

const TRIP_EMOJIS = ['🗺️', '✈️', '🏝️', '🏔️', '🌍', '🎌', '🗼', '🏛️', '🌴', '🎭', '🏄', '🚂'];
const TRIP_THEMES = [
  { label: 'Adventure', color: '#ecfdf5', text: '#065f46', border: '#a7f3d0', emoji: '🏔️' },
  { label: 'Cultural', color: '#fdf2f8', text: '#9d174d', border: '#fbcfe8', emoji: '🏛️' },
  { label: 'Relaxation', color: '#ecfeff', text: '#155e75', border: '#a5f3fc', emoji: '🏝️' },
  { label: 'Foodie', color: '#fffbeb', text: '#92400e', border: '#fde68a', emoji: '🍜' },
  { label: 'Romantic', color: '#fff1f2', text: '#9f1239', border: '#fecdd3', emoji: '💑' },
  { label: 'Road Trip', color: '#eff6ff', text: '#1e40af', border: '#bfdbfe', emoji: '🚗' },
];

export default function CreateTripModal({
  isOpen,
  onClose,
  onTripCreated,
  currencySymbol = '₹'
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('2026-10-01');
  const [endDate, setEndDate] = useState('2026-10-08');
  const [budgetLimit, setBudgetLimit] = useState('45000');
  const [selectedEmoji, setSelectedEmoji] = useState('🗺️');
  const [selectedTheme, setSelectedTheme] = useState(TRIP_THEMES[0]);
  const [initialCity, setInitialCity] = useState('Jaipur');
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const days = (() => {
    const s = new Date(startDate), e = new Date(endDate);
    return isNaN(s) || isNaN(e) ? 0 : Math.max(1, Math.round((e - s) / 86400000));
  })();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const startingStop = {
      id: `stop-${Date.now()}`,
      city: MOCK_CITIES.find(c => c.name.toLowerCase() === initialCity.toLowerCase()) || {
        name: initialCity || 'Jaipur',
        country: 'India',
        imageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800'
      },
      startDate,
      endDate,
      order: 1,
      activities: []
    };

    const payload = {
      name: name.trim() || `Royal Tour: ${initialCity} & Beyond ${selectedEmoji}`,
      description: description.trim() || `Exciting ${days}-day multi-city journey focusing on ${selectedTheme?.label || 'Heritage & Culture'}.`,
      startDate,
      endDate,
      budgetLimit: parseFloat(budgetLimit) || 35000,
      coverPhoto: selectedEmoji,
      isPublic,
      theme: selectedTheme?.label,
      stops: [startingStop]
    };

    try {
      const res = await api.post('/trips', payload);
      onTripCreated(res.data.trip || { ...payload, id: `trip-${Date.now()}` });
      onClose();
    } catch (err) {
      onTripCreated({ ...payload, id: `trip-${Date.now()}`, shareSlug: `trip-${Date.now()}` });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 999,
        background: 'rgba(15,23,42,0.65)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#ffffff', borderRadius: '28px', width: '100%', maxWidth: '560px',
          maxHeight: '90vh', overflowY: 'auto',
          boxShadow: '0 24px 80px rgba(0,0,0,0.25)', border: '1px solid #e2e8f0'
        }}
      >
        {/* Modal Header */}
        <div style={{
          background: 'linear-gradient(135deg, #042f2e 0%, #064e3b 40%, #0f172a 100%)',
          padding: '28px 32px', position: 'relative'
        }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: '20px', right: '20px',
              background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '10px',
              width: '34px', height: '34px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            <X size={18} color="#ffffff" />
          </button>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.35)', borderRadius: '99px', padding: '4px 12px', marginBottom: '8px' }}>
            <Sparkles size={12} color="#34d399" />
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#6ee7b7', letterSpacing: '0.05em' }}>
              NEW CUSTOM ITINERARY
            </span>
          </div>

          <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#ffffff', margin: 0, letterSpacing: '-0.5px' }}>
            Plan Your Journey
          </h2>
          <p style={{ fontSize: '13px', color: '#cbd5e1', margin: '6px 0 0' }}>
            Set trip parameters, target budget ceiling, and travel dates
          </p>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} style={{ padding: '28px 32px 36px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Trip Name */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>
              Trip Title
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. European Dream Vacation, Autumn in Tokyo..."
              style={{
                width: '100%', background: '#f8fafc', border: '1.5px solid #cbd5e1',
                borderRadius: '12px', padding: '12px 14px', fontSize: '14px', fontWeight: 600, color: '#0f172a', outline: 'none'
              }}
            />
          </div>

          {/* Starting City */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>
              First Destination / Starting City
            </label>
            <input
              type="text"
              value={initialCity}
              onChange={e => setInitialCity(e.target.value)}
              placeholder="e.g. Paris, Tokyo, Rome, New York, Bali..."
              style={{
                width: '100%', background: '#f8fafc', border: '1.5px solid #cbd5e1',
                borderRadius: '12px', padding: '12px 14px', fontSize: '14px', fontWeight: 600, color: '#0f172a', outline: 'none'
              }}
            />
          </div>

          {/* Emoji Badge Selector */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>
              Itinerary Avatar Badge
            </label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {TRIP_EMOJIS.map(emoji => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setSelectedEmoji(emoji)}
                  style={{
                    width: '38px', height: '38px', borderRadius: '10px', fontSize: '18px',
                    border: selectedEmoji === emoji ? '2.5px solid #0d9488' : '1.5px solid #cbd5e1',
                    background: selectedEmoji === emoji ? '#f0fdf9' : '#ffffff',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: selectedEmoji === emoji ? '0 2px 8px rgba(13,148,136,0.3)' : 'none'
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Travel Style Theme */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>
              Travel Style & Atmosphere
            </label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {TRIP_THEMES.map(theme => (
                <button
                  key={theme.label}
                  type="button"
                  onClick={() => setSelectedTheme(theme)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '8px 14px', borderRadius: '10px', fontSize: '12px', fontWeight: 800,
                    background: selectedTheme?.label === theme.label ? theme.color : '#f8fafc',
                    color: selectedTheme?.label === theme.label ? theme.text : '#475569',
                    border: selectedTheme?.label === theme.label ? `1.5px solid ${theme.border}` : '1.5px solid #cbd5e1',
                    cursor: 'pointer'
                  }}
                >
                  <span>{theme.emoji}</span>
                  <span>{theme.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Date range picker */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '6px' }}>📅 START DATE</label>
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                style={{ width: '100%', background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '12px', padding: '10px 14px', fontSize: '13px', fontWeight: 600, color: '#0f172a', outline: 'none' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '6px' }}>📅 END DATE</label>
              <input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                style={{ width: '100%', background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '12px', padding: '10px 14px', fontSize: '13px', fontWeight: 600, color: '#0f172a', outline: 'none' }}
              />
            </div>
          </div>

          {/* Target Budget */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>
              Target Budget Ceiling ({currencySymbol})
            </label>
            <input
              type="number"
              value={budgetLimit}
              onChange={e => setBudgetLimit(e.target.value)}
              placeholder="3200"
              style={{
                width: '100%', background: '#f8fafc', border: '1.5px solid #cbd5e1',
                borderRadius: '12px', padding: '12px 14px', fontSize: '14px', fontWeight: 700, color: '#0f172a', outline: 'none'
              }}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading ? '#94a3b8' : 'linear-gradient(135deg, #0d9488 0%, #10b981 100%)',
              color: '#ffffff', border: 'none', borderRadius: '14px',
              padding: '14px', fontSize: '14px', fontWeight: 900,
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 16px rgba(13,148,136,0.35)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              marginTop: '10px'
            }}
          >
            <PlusCircle size={18} strokeWidth={2.5} />
            <span>{loading ? 'Initializing Itinerary...' : 'Create Itinerary & Open Workspace'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
