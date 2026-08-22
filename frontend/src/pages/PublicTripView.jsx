import React from 'react';
import { Share2, Copy, MapPin, Calendar, DollarSign, ArrowLeft, Globe, Star, Users } from 'lucide-react';

const CAT_EMOJIS = {
  Sightseeing: '🎯', Food: '🍽️', Adventure: '⛺', Culture: '🏛️',
  Shopping: '🛍️', Relaxation: '🧘', Nightlife: '🎉', Transport: '🚌'
};

export default function PublicTripView({ publicTrip, onCopyTripToAccount, onBackToDashboard }) {
  if (!publicTrip) {
    return (
      <div style={{ background: 'white', borderRadius: 20, padding: '60px', textAlign: 'center', border: '1.5px dashed #e2e8f0' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🌐</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#374151' }}>No trip to share</div>
      </div>
    );
  }

  const stops = publicTrip.stops || [];
  const totalActivities = stops.reduce((s, st) => s + (st.activities?.length || 0), 0);
  const totalCost = stops.reduce((s, st) => s + (st.activities || []).reduce((a, act) => a + (act.cost || 0), 0), 0);
  const start = new Date(publicTrip.startDate);
  const end = new Date(publicTrip.endDate);
  const days = isNaN(start) || isNaN(end) ? 7 : Math.max(1, Math.round((end - start) / 86400000));

  const shareUrl = `${window.location.origin}/trip/${publicTrip.shareSlug || publicTrip.id}`;

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(shareUrl).catch(() => {});
    alert('Share link copied!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Back Button */}
      <button onClick={onBackToDashboard} style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        background: 'none', border: 'none', cursor: 'pointer',
        color: '#64748b', fontSize: 12, fontWeight: 700, padding: 0
      }}>
        <ArrowLeft size={14} /> Back to Dashboard
      </button>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a, #134e4a)',
        borderRadius: 24, padding: '36px', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: -50, right: -50, width: 200, height: 200,
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.15), transparent)'
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 14,
            background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.25)',
            borderRadius: 99, padding: '5px 12px'
          }}>
            <Globe size={11} color="#34d399" />
            <span style={{ fontSize: 10, fontWeight: 700, color: '#34d399', letterSpacing: '0.06em' }}>PUBLIC TRIP</span>
          </div>

          <h1 style={{ fontSize: 28, fontWeight: 900, color: 'white', margin: 0, letterSpacing: '-0.8px' }}>
            {publicTrip.name}
          </h1>
          {publicTrip.description && (
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', margin: '10px 0 0', maxWidth: 560, lineHeight: 1.6 }}>
              {publicTrip.description}
            </p>
          )}

          <div style={{ display: 'flex', gap: 20, marginTop: 16, flexWrap: 'wrap' }}>
            {[
              { icon: MapPin, label: `${stops.length} cities` },
              { icon: Calendar, label: `${days} days` },
              { icon: Star, label: `${totalActivities} activities` },
              { icon: DollarSign, label: `$${totalCost.toLocaleString()} est.` },
            ].map(({ icon: Icon, label }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Icon size={12} color="rgba(255,255,255,0.4)" />
                <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.6)' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Share + Copy Actions */}
      <div style={{
        background: 'white', borderRadius: 16, padding: '18px 22px',
        border: '1.5px solid #e8f0ef', display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap'
      }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.05em', marginBottom: 4 }}>SHARE LINK</div>
          <div style={{
            background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 10,
            padding: '8px 12px', fontSize: 12, color: '#64748b', fontFamily: 'monospace'
          }}>
            {shareUrl.slice(0, 50)}...
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          <button onClick={handleCopyLink} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'white', border: '1.5px solid #e2e8f0', borderRadius: 10,
            padding: '9px 16px', fontSize: 12, fontWeight: 700, color: '#374151', cursor: 'pointer'
          }}>
            <Copy size={13} /> Copy Link
          </button>
          <button onClick={() => onCopyTripToAccount(publicTrip)} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'linear-gradient(135deg, #0d9488, #10b981)',
            color: 'white', border: 'none', borderRadius: 10,
            padding: '9px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(13,148,136,0.3)'
          }}>
            <Users size={13} /> Clone to My Trips
          </button>
        </div>
      </div>

      {/* Stops */}
      {stops.map((stop, idx) => {
        const cityName = stop.city?.name || stop.city || 'City';
        const activities = stop.activities || [];

        return (
          <div key={stop.id || idx} style={{
            background: 'white', borderRadius: 20,
            border: '1.5px solid #e8f0ef', overflow: 'hidden'
          }}>
            <div style={{
              padding: '16px 22px', borderBottom: '1px solid #f1f5f9',
              display: 'flex', alignItems: 'center', gap: 14,
              background: 'linear-gradient(135deg, #f0fdf9, #fff)'
            }}>
              <div style={{
                width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                background: 'linear-gradient(135deg, #0d9488, #10b981)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, fontWeight: 900, color: 'white'
              }}>
                {idx + 1}
              </div>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 900, color: '#0f172a', margin: 0 }}>📍 {cityName}</h3>
                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
                  {activities.length} activities
                </div>
              </div>
            </div>

            <div style={{ padding: '14px 22px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {activities.length === 0 ? (
                <div style={{ color: '#94a3b8', fontSize: 12, textAlign: 'center', padding: '12px 0' }}>
                  No activities planned
                </div>
              ) : activities.map((act, i) => (
                <div key={act.id || i} style={{
                  display: 'flex', gap: 12, padding: '10px 14px',
                  background: '#f8fafc', borderRadius: 10
                }}>
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{CAT_EMOJIS[act.category] || '🎯'}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>{act.name}</div>
                    <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                      {act.duration && <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600 }}>⏱ {act.duration}</span>}
                      {act.cost > 0 && <span style={{ fontSize: 10, color: '#0d9488', fontWeight: 700 }}>💰 ${act.cost}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
