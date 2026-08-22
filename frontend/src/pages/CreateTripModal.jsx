import React, { useState } from 'react';
import { X, Calendar, DollarSign, FileText, PlusCircle, MapPin, Globe, Lock, Check } from 'lucide-react';
import api from '../api/client';

const TRIP_EMOJIS = ['🗺️', '✈️', '🏝️', '🏔️', '🌍', '🎌', '🗼', '🏛️', '🌴', '🎭', '🏄', '🚂'];
const TRIP_THEMES = [
  { label: 'Adventure', color: '#dcfce7', text: '#166534', emoji: '🏔️' },
  { label: 'Cultural', color: '#fce7f3', text: '#9d174d', emoji: '🏛️' },
  { label: 'Relaxation', color: '#cffafe', text: '#164e63', emoji: '🏝️' },
  { label: 'Foodie', color: '#fef3c7', text: '#92400e', emoji: '🍜' },
  { label: 'Romantic', color: '#ffe4e6', text: '#9f1239', emoji: '💑' },
  { label: 'Business', color: '#eff6ff', text: '#1e40af', emoji: '💼' },
];

const InputLabel = ({ children }) => (
  <label style={{ fontSize: 10, fontWeight: 700, color: '#64748b', display: 'block', marginBottom: 6, letterSpacing: '0.06em' }}>
    {children}
  </label>
);

const InputStyle = {
  width: '100%', background: '#f8fafc', border: '1.5px solid #e2e8f0',
  borderRadius: 10, padding: '10px 12px',
  fontSize: 13, color: '#0f172a', outline: 'none', fontFamily: 'Inter, sans-serif'
};

export default function CreateTripModal({ isOpen, onClose, onTripCreated }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('2026-09-01');
  const [endDate, setEndDate] = useState('2026-09-10');
  const [budgetLimit, setBudgetLimit] = useState('2500');
  const [selectedEmoji, setSelectedEmoji] = useState('🗺️');
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const days = (() => {
    const s = new Date(startDate), e = new Date(endDate);
    return isNaN(s) || isNaN(e) ? 0 : Math.max(0, Math.round((e - s) / 86400000));
  })();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      name: name || `My Trip ${selectedEmoji}`,
      description,
      startDate,
      endDate,
      budgetLimit: parseFloat(budgetLimit) || 0,
      coverPhoto: selectedEmoji,
      isPublic,
      theme: selectedTheme?.label,
    };
    try {
      const res = await api.post('/trips', payload);
      onTripCreated(res.data.trip || { ...payload, id: `trip-${Date.now()}`, stops: [] });
      onClose();
    } catch (err) {
      onTripCreated({ ...payload, id: `trip-${Date.now()}`, shareSlug: `trip-${Date.now()}`, stops: [] });
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
        background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'white', borderRadius: 24, width: '100%', maxWidth: 520,
          maxHeight: '90vh', overflowY: 'auto',
          boxShadow: '0 24px 80px rgba(0,0,0,0.2)'
        }}
      >
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #0f172a, #134e4a)',
          padding: '28px 32px 24px', position: 'relative'
        }}>
          <button onClick={onClose} style={{
            position: 'absolute', top: 16, right: 16,
            background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 8,
            width: 30, height: 30, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <X size={14} color="white" />
          </button>
          <div style={{ fontSize: 28, marginBottom: 8 }}>🌍</div>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: 'white', margin: 0, letterSpacing: '-0.5px' }}>
            Plan a New Trip
          </h2>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', margin: '5px 0 0' }}>
            Create a multi-city itinerary with budget & dates
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '24px 32px 32px', display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Trip Name */}
          <div>
            <InputLabel>TRIP NAME</InputLabel>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Autumn in Japan & France"
              style={InputStyle}
            />
          </div>

          {/* Emoji Picker */}
          <div>
            <InputLabel>TRIP ICON</InputLabel>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {TRIP_EMOJIS.map(emoji => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setSelectedEmoji(emoji)}
                  style={{
                    width: 36, height: 36, borderRadius: 8, fontSize: 16,
                    border: selectedEmoji === emoji ? '2px solid #0d9488' : '1.5px solid #e2e8f0',
                    background: selectedEmoji === emoji ? '#f0fdf9' : 'white',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.1s'
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Theme */}
          <div>
            <InputLabel>TRIP STYLE (OPTIONAL)</InputLabel>
            <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
              {TRIP_THEMES.map(theme => (
                <button
                  key={theme.label}
                  type="button"
                  onClick={() => setSelectedTheme(selectedTheme?.label === theme.label ? null : theme)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    padding: '5px 12px', borderRadius: 8, fontSize: 11, fontWeight: 700,
                    background: selectedTheme?.label === theme.label ? theme.color : 'white',
                    color: selectedTheme?.label === theme.label ? theme.text : '#64748b',
                    border: selectedTheme?.label === theme.label ? `1.5px solid ${theme.text}40` : '1.5px solid #e2e8f0',
                    cursor: 'pointer', transition: 'all 0.1s'
                  }}
                >
                  {theme.emoji} {theme.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dates */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <InputLabel>📅 START DATE</InputLabel>
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={InputStyle} />
            </div>
            <div>
              <InputLabel>📅 END DATE</InputLabel>
              <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} style={InputStyle} />
            </div>
          </div>

          {days > 0 && (
            <div style={{
              background: '#f0fdf9', border: '1px solid #99f6e4', borderRadius: 10,
              padding: '8px 14px', fontSize: 12, fontWeight: 700, color: '#0f766e',
              display: 'flex', alignItems: 'center', gap: 6
            }}>
              <Calendar size={13} />
              {days} day{days !== 1 ? 's' : ''} trip planned
            </div>
          )}

          {/* Budget */}
          <div>
            <InputLabel>💰 TOTAL BUDGET (USD)</InputLabel>
            <input
              type="number"
              value={budgetLimit}
              onChange={e => setBudgetLimit(e.target.value)}
              placeholder="2500"
              style={InputStyle}
            />
          </div>

          {/* Description */}
          <div>
            <InputLabel>DESCRIPTION</InputLabel>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Your travel goals, companions, or highlights..."
              style={{ ...InputStyle, resize: 'none' }}
            />
          </div>

          {/* Visibility */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {isPublic ? <Globe size={15} color="#0d9488" /> : <Lock size={15} color="#7c3aed" />}
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>
                  {isPublic ? 'Public Trip' : 'Private Trip'}
                </div>
                <div style={{ fontSize: 10, color: '#94a3b8' }}>
                  {isPublic ? 'Discoverable by other travelers' : 'Only visible to you'}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsPublic(p => !p)}
              style={{
                width: 44, height: 24, borderRadius: 99, border: 'none', cursor: 'pointer',
                background: isPublic ? 'linear-gradient(135deg, #0d9488, #10b981)' : '#e2e8f0',
                position: 'relative', transition: 'background 0.2s'
              }}
            >
              <div style={{
                position: 'absolute', top: 3, left: isPublic ? 22 : 3,
                width: 18, height: 18, borderRadius: '50%', background: 'white',
                transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)'
              }} />
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading ? '#94a3b8' : 'linear-gradient(135deg, #0d9488, #10b981)',
              color: 'white', border: 'none', borderRadius: 12,
              padding: '13px', fontSize: 13, fontWeight: 800,
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 4px 16px rgba(13,148,136,0.35)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
            }}
          >
            <PlusCircle size={16} />
            {loading ? 'Creating Trip...' : 'Create Trip & Start Planning'}
          </button>
        </form>
      </div>
    </div>
  );
}
