import React, { useState } from 'react';
import {
  User, Mail, Globe, Heart, Shield, LogOut,
  Save, Check, MapPin, Compass, Sparkles, Award
} from 'lucide-react';
import api from '../api/client';

export default function UserProfile({
  user,
  trips = [],
  currency,
  setCurrency,
  onUpdateUser,
  onLogout,
  onNavigateTab
}) {
  const [name, setName] = useState(user?.name || 'Alex Johnson');
  const [email, setEmail] = useState(user?.email || 'alex.traveler@example.com');
  const [bio, setBio] = useState('Passionate global nomad, architecture enthusiast, and coffee hunter exploring cultural gems across Europe and Asia.');
  const [travelStyle, setTravelStyle] = useState(['Cultural & Heritage', 'Food & Wine', 'Boutique & Scenic']);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const wishlistCities = [
    { name: 'Reykjavik', country: 'Iceland', flag: '🇮🇸', tag: 'Northern Lights' },
    { name: 'Cape Town', country: 'South Africa', flag: '🇿🇦', tag: 'Safari & Ocean' },
    { name: 'Kyoto', country: 'Japan', flag: '🇯🇵', tag: 'Ancient Shrines' },
  ];

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put('/auth/profile', { name });
      if (res.data && res.data.user) {
        onUpdateUser({ ...user, ...res.data.user, email, bio });
      } else {
        onUpdateUser({ ...user, name, email, bio });
      }
    } catch (err) {
      console.error('Failed to update profile on server:', err);
      onUpdateUser({ ...user, name, email, bio });
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

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
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{
            width: '72px', height: '72px', borderRadius: '20px',
            background: 'linear-gradient(135deg, #0d9488 0%, #f59e0b 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '28px', fontWeight: 900, color: '#ffffff',
            boxShadow: '0 8px 24px rgba(13,148,136,0.4)'
          }}>
            {name[0]?.toUpperCase() || 'U'}
          </div>

          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 900, color: '#ffffff', margin: 0, letterSpacing: '-0.5px' }}>
              {name}
            </h1>
            <div style={{ fontSize: '13px', color: '#cbd5e1', marginTop: '4px' }}>
              {email} · GlobeTrotter Explorer Member
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Profile Form + Stats & Wishlist */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>

        {/* Left: Profile Settings Form */}
        <div style={{
          background: '#ffffff', borderRadius: '24px', padding: '28px',
          border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: 900, color: '#0f172a', margin: '0 0 20px' }}>
            Account & Travel Profile
          </h2>

          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '6px' }}>Full Name</label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                style={{ width: '100%', background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '12px', padding: '10px 14px', fontSize: '13px', color: '#0f172a', fontWeight: 600, outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '6px' }}>Email Address</label>
              <input
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{ width: '100%', background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '12px', padding: '10px 14px', fontSize: '13px', color: '#0f172a', fontWeight: 600, outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '6px' }}>Traveler Bio</label>
              <textarea
                rows={3}
                value={bio}
                onChange={e => setBio(e.target.value)}
                style={{ width: '100%', background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '12px', padding: '10px 14px', fontSize: '13px', color: '#0f172a', fontWeight: 500, outline: 'none', resize: 'none' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 800, color: '#475569', display: 'block', marginBottom: '6px' }}>Preferred Currency</label>
              <select
                value={currency}
                onChange={e => setCurrency(e.target.value)}
                style={{ width: '100%', background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '12px', padding: '10px 14px', fontSize: '13px', color: '#0f172a', fontWeight: 700, outline: 'none' }}
              >
                <option value="USD">USD ($) — US Dollar</option>
                <option value="EUR">EUR (€) — Euro</option>
                <option value="GBP">GBP (£) — British Pound</option>
                <option value="JPY">JPY (¥) — Japanese Yen</option>
                <option value="INR">INR (₹) — Indian Rupee</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button
                type="submit"
                style={{
                  flex: 1, padding: '12px', borderRadius: '12px',
                  background: savedSuccess ? '#10b981' : 'linear-gradient(135deg, #0d9488 0%, #10b981 100%)',
                  color: '#ffffff', border: 'none', fontSize: '13px', fontWeight: 800, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  boxShadow: '0 4px 14px rgba(13,148,136,0.3)'
                }}
              >
                {savedSuccess ? <Check size={16} strokeWidth={3} /> : <Save size={16} />}
                <span>{savedSuccess ? 'Profile Updated!' : 'Save Changes'}</span>
              </button>

              <button
                type="button"
                onClick={onLogout}
                style={{
                  padding: '12px 18px', borderRadius: '12px',
                  border: '1.5px solid #fecaca', background: '#fff5f5',
                  color: '#ef4444', fontSize: '13px', fontWeight: 800, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '6px'
                }}
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right: Travel Passport Stats & Saved Wishlist */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Stats Passport */}
          <div style={{
            background: '#ffffff', borderRadius: '24px', padding: '24px',
            border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: 900, color: '#0f172a', margin: '0 0 16px' }}>
              Travel Passport Achievements
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              <div style={{ background: '#f0fdf9', padding: '16px', borderRadius: '16px', textAlign: 'center', border: '1px solid #a7f3d0' }}>
                <div style={{ fontSize: '24px', fontWeight: 900, color: '#0f766e' }}>{trips.length}</div>
                <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, marginTop: '2px' }}>Trips Planned</div>
              </div>
              <div style={{ background: '#faf5ff', padding: '16px', borderRadius: '16px', textAlign: 'center', border: '1px solid #e9d5ff' }}>
                <div style={{ fontSize: '24px', fontWeight: 900, color: '#7c3aed' }}>12</div>
                <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, marginTop: '2px' }}>Cities Visited</div>
              </div>
              <div style={{ background: '#eff6ff', padding: '16px', borderRadius: '16px', textAlign: 'center', border: '1px solid #bfdbfe' }}>
                <div style={{ fontSize: '24px', fontWeight: 900, color: '#2563eb' }}>4</div>
                <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, marginTop: '2px' }}>Passports Stamps</div>
              </div>
            </div>
          </div>

          {/* Wishlist */}
          <div style={{
            background: '#ffffff', borderRadius: '24px', padding: '24px',
            border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                Saved Destination Wishlist
              </h3>
              <button
                onClick={() => onNavigateTab('cities')}
                style={{ fontSize: '12px', fontWeight: 800, color: '#0d9488', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                + Browse More
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {wishlistCities.map(w => (
                <div
                  key={w.name}
                  style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '12px 16px', background: '#f8fafc', borderRadius: '14px', border: '1px solid #e2e8f0'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '20px' }}>{w.flag}</span>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>{w.name}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{w.country} · {w.tag}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigateTab('cities')}
                    style={{
                      background: '#f0fdf9', border: '1px solid #a7f3d0', borderRadius: '8px',
                      padding: '6px 12px', fontSize: '11px', fontWeight: 800, color: '#0f766e', cursor: 'pointer'
                    }}
                  >
                    Plan Trip
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
