import React, { useState } from 'react';
import {
  Share2, Copy, Check, Heart, Globe, MapPin, Calendar,
  Clock, DollarSign, ArrowLeft, ArrowRight, Sparkles, Send
} from 'lucide-react';

export default function PublicTripView({
  publicTrip,
  onCopyTripToAccount,
  onBackToDashboard,
  currencySymbol = '$'
}) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [clonedSuccess, setClonedSuccess] = useState(false);
  const [likes, setLikes] = useState(48);
  const [liked, setLiked] = useState(false);

  if (!publicTrip) {
    return (
      <div style={{
        background: '#ffffff', borderRadius: '24px', padding: '60px 24px',
        textAlign: 'center', border: '2px dashed #cbd5e1'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔗</div>
        <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a' }}>No Public Trip Selected</h2>
        <p style={{ fontSize: '14px', color: '#64748b', marginTop: '6px' }}>
          Select a trip from your list to generate a shareable community link.
        </p>
      </div>
    );
  }

  const shareUrl = `${window.location.origin}/#/share?trip=${publicTrip.shareSlug || publicTrip.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCloneTrip = () => {
    onCopyTripToAccount(publicTrip);
    setClonedSuccess(true);
    setTimeout(() => setClonedSuccess(false), 3000);
  };

  const handleToggleLike = () => {
    setLiked(!liked);
    setLikes(prev => liked ? prev - 1 : prev + 1);
  };

  const stops = publicTrip.stops || [];
  const totalActivities = stops.reduce((s, st) => s + (st.activities?.length || 0), 0);
  const totalCost = stops.reduce((s, st) => s + (st.activities || []).reduce((a, act) => a + (act.cost || 0), 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* 1. Public Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #042f2e 0%, #064e3b 40%, #0f172a 100%)',
        borderRadius: '24px', padding: '36px 40px',
        position: 'relative', overflow: 'hidden',
        boxShadow: '0 12px 36px -8px rgba(4, 47, 46, 0.4)',
        border: '1px solid rgba(16, 185, 129, 0.2)'
      }}>
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ maxWidth: '680px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.35)', borderRadius: '99px', padding: '4px 12px', marginBottom: '10px' }}>
              <Globe size={12} color="#34d399" />
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#6ee7b7', letterSpacing: '0.05em' }}>
                PUBLIC ITINERARY SHOWCASE
              </span>
            </div>

            <h1 style={{ fontSize: '32px', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.5px', margin: 0 }}>
              {publicTrip.name}
            </h1>

            <p style={{ fontSize: '14px', color: '#cbd5e1', marginTop: '8px', lineHeight: 1.6 }}>
              {publicTrip.description || 'A complete hand-crafted multi-city journey shared with the GlobeTrotter travel community.'}
            </p>

            {/* Quick Metrics */}
            <div style={{ display: 'flex', gap: '18px', marginTop: '18px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '13px', color: '#cbd5e1', fontWeight: 700 }}>
                📍 {stops.length} Cities
              </span>
              <span style={{ fontSize: '13px', color: '#cbd5e1', fontWeight: 700 }}>
                🎯 {totalActivities} Experiences
              </span>
              <span style={{ fontSize: '13px', color: '#6ee7b7', fontWeight: 900 }}>
                💰 {currencySymbol}{totalCost.toLocaleString()} Planned
              </span>
            </div>
          </div>

          {/* 1-Click Clone to My Account & Like */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={handleToggleLike}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                background: liked ? '#fee2e2' : 'rgba(255,255,255,0.15)',
                border: liked ? '1px solid #fca5a5' : '1px solid rgba(255,255,255,0.25)',
                color: liked ? '#e11d48' : '#ffffff', borderRadius: '12px',
                padding: '12px 18px', fontSize: '13px', fontWeight: 800, cursor: 'pointer'
              }}
            >
              <Heart size={16} fill={liked ? '#e11d48' : 'none'} />
              <span>{likes}</span>
            </button>

            <button
              onClick={handleCloneTrip}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                background: clonedSuccess ? '#10b981' : 'linear-gradient(135deg, #0d9488 0%, #10b981 100%)',
                color: '#ffffff', border: 'none', borderRadius: '12px',
                padding: '12px 22px', fontSize: '13px', fontWeight: 800, cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(13,148,136,0.4)'
              }}
            >
              {clonedSuccess ? <Check size={16} strokeWidth={3} /> : <Copy size={16} />}
              <span>{clonedSuccess ? 'Cloned to Your Trips!' : 'Clone / Copy Trip'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Share Link & Social Broadcast Bar */}
      <div style={{
        background: '#ffffff', borderRadius: '20px', padding: '20px 24px',
        border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px'
      }}>
        <div style={{ flex: 1, minWidth: '280px' }}>
          <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>
            Direct Shareable URL
          </div>
          <div style={{
            background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '12px',
            padding: '8px 14px', fontSize: '13px', color: '#0f172a', fontWeight: 600,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
          }}>
            {shareUrl}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleCopyLink}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: copiedLink ? '#10b981' : '#0d9488', color: '#ffffff',
              border: 'none', borderRadius: '12px', padding: '10px 18px',
              fontSize: '13px', fontWeight: 800, cursor: 'pointer'
            }}
          >
            {copiedLink ? <Check size={15} strokeWidth={3} /> : <Copy size={15} />}
            <span>{copiedLink ? 'Link Copied!' : 'Copy Link'}</span>
          </button>
        </div>
      </div>

      {/* 3. Read-Only Stops & Activities Overview */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 900, color: '#0f172a', margin: 0 }}>
          Master Itinerary Overview
        </h2>

        {stops.map((stop, idx) => {
          const cityName = stop.city?.name || stop.city || 'City';
          const activities = stop.activities || [];

          return (
            <div
              key={stop.id || idx}
              style={{
                background: '#ffffff', borderRadius: '20px',
                border: '1px solid #e2e8f0', padding: '22px 26px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '10px',
                  background: 'linear-gradient(135deg, #0d9488 0%, #10b981 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '14px', fontWeight: 900, color: '#ffffff'
                }}>
                  {idx + 1}
                </div>

                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                    {cityName}
                  </h3>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    {activities.length} curated activities
                  </div>
                </div>
              </div>

              {/* Activity Pills */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px' }}>
                {activities.map((act, aIdx) => (
                  <div
                    key={act.id || aIdx}
                    style={{
                      background: '#f8fafc', borderRadius: '12px', padding: '12px 14px',
                      border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>{act.name}</div>
                      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                        {act.category || 'Sightseeing'} · {act.duration || '2h'}
                      </div>
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: 800, color: '#0d9488' }}>
                      {currencySymbol}{act.cost || 0}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
