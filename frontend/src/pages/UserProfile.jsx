import React, { useState } from 'react';
import { User, Mail, Globe, Camera, Shield, Save, LogOut, Star, Map, DollarSign, Calendar } from 'lucide-react';

const AVATAR_COLORS = ['#0d9488', '#7c3aed', '#f59e0b', '#3b82f6', '#ec4899', '#22c55e'];

export default function UserProfile({ user, onUpdateUser, onLogout }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || 'Traveler',
    email: user?.email || 'traveler@globetrotter.com',
    bio: user?.bio || 'Passionate explorer of new cultures and destinations.',
    avatarColor: user?.avatarColor || '#0d9488',
  });

  const handleSave = () => {
    onUpdateUser({ ...user, ...form });
    setEditing(false);
  };

  const profileUser = user || { name: 'Traveler', email: 'demo@globetrotter.com' };
  const displayName = form.name || profileUser.name;
  const initial = displayName[0]?.toUpperCase() || 'T';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 680, margin: '0 auto' }}>
      {/* Profile Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a, #134e4a)',
        borderRadius: 24, padding: '36px', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: -40, right: -40, width: 150, height: 150,
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.12), transparent)'
        }} />

        <div style={{ display: 'flex', gap: 20, alignItems: 'center', position: 'relative' }}>
          {/* Avatar */}
          <div style={{
            width: 72, height: 72, borderRadius: 20, flexShrink: 0,
            background: `linear-gradient(135deg, ${form.avatarColor}, ${form.avatarColor}aa)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, fontWeight: 900, color: 'white',
            boxShadow: `0 8px 24px ${form.avatarColor}50`
          }}>
            {initial}
          </div>

          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 22, fontWeight: 900, color: 'white', margin: 0, letterSpacing: '-0.5px' }}>
              {displayName}
            </h1>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>{form.email}</div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 8,
              background: 'rgba(13,148,136,0.2)', border: '1px solid rgba(13,148,136,0.3)',
              borderRadius: 99, padding: '3px 10px'
            }}>
              <Star size={10} color="#34d399" fill="#34d399" />
              <span style={{ fontSize: 10, fontWeight: 700, color: '#34d399' }}>Globe Explorer</span>
            </div>
          </div>

          <button
            onClick={() => setEditing(e => !e)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)',
              color: 'white', borderRadius: 10, padding: '8px 14px',
              fontSize: 12, fontWeight: 700, cursor: 'pointer'
            }}
          >
            {editing ? 'Cancel' : '✏️ Edit Profile'}
          </button>
        </div>
      </div>

      {/* Edit Form */}
      {editing && (
        <div style={{ background: 'white', borderRadius: 20, padding: '24px', border: '1.5px solid #e8f0ef' }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', margin: '0 0 18px' }}>Edit Profile</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ fontSize: 10, fontWeight: 700, color: '#64748b', display: 'block', marginBottom: 6, letterSpacing: '0.06em' }}>FULL NAME</label>
              <input
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                style={{
                  width: '100%', background: '#f8fafc', border: '1.5px solid #e2e8f0',
                  borderRadius: 10, padding: '10px 12px', fontSize: 13, color: '#0f172a',
                  outline: 'none', fontFamily: 'Inter, sans-serif'
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: 10, fontWeight: 700, color: '#64748b', display: 'block', marginBottom: 6, letterSpacing: '0.06em' }}>BIO</label>
              <textarea
                value={form.bio}
                onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                rows={2}
                style={{
                  width: '100%', background: '#f8fafc', border: '1.5px solid #e2e8f0',
                  borderRadius: 10, padding: '10px 12px', fontSize: 13, color: '#0f172a',
                  outline: 'none', fontFamily: 'Inter, sans-serif', resize: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: 10, fontWeight: 700, color: '#64748b', display: 'block', marginBottom: 8, letterSpacing: '0.06em' }}>AVATAR COLOR</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {AVATAR_COLORS.map(c => (
                  <button key={c} type="button" onClick={() => setForm(f => ({ ...f, avatarColor: c }))} style={{
                    width: 32, height: 32, borderRadius: '50%', background: c, border: 'none',
                    cursor: 'pointer', outline: form.avatarColor === c ? `3px solid ${c}` : 'none',
                    outlineOffset: '2px', transition: 'outline 0.1s'
                  }} />
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={handleSave} style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                background: 'linear-gradient(135deg, #0d9488, #10b981)',
                color: 'white', border: 'none', borderRadius: 10,
                padding: '11px', fontSize: 13, fontWeight: 700, cursor: 'pointer'
              }}>
                <Save size={14} /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Info */}
      {!editing && (
        <div style={{ background: 'white', borderRadius: 20, padding: '24px', border: '1.5px solid #e8f0ef' }}>
          <h3 style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', margin: '0 0 16px' }}>About</h3>
          <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.7, margin: 0 }}>{form.bio}</p>
        </div>
      )}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {[
          { label: 'Trips Planned', value: '3', icon: Map, bg: '#f0fdf9', color: '#0d9488' },
          { label: 'Cities Visited', value: '8', icon: Globe, bg: '#faf5ff', color: '#7c3aed' },
          { label: 'Total Budget', value: '$12,500', icon: DollarSign, bg: '#fffbeb', color: '#f59e0b' },
        ].map(({ label, value, icon: Icon, bg, color }) => (
          <div key={label} style={{ background: bg, borderRadius: 16, padding: '18px 16px', border: '1px solid rgba(0,0,0,0.04)' }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: color, display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 10
            }}>
              <Icon size={16} color="white" />
            </div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.5px' }}>{value}</div>
            <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Logout */}
      <div style={{ background: 'white', borderRadius: 16, padding: '16px 20px', border: '1.5px solid #f1f5f9' }}>
        <button
          onClick={onLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: '#fff5f5', border: '1px solid #fed7d7',
            color: '#e53e3e', borderRadius: 10, padding: '10px 18px',
            fontSize: 13, fontWeight: 700, cursor: 'pointer'
          }}
        >
          <LogOut size={14} /> Sign Out
        </button>
      </div>
    </div>
  );
}
