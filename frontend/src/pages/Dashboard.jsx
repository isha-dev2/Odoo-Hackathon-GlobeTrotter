import React, { useState } from 'react';
import {
  MapPin, Calendar, DollarSign, Users, TrendingUp, Star, Plus,
  ArrowRight, Compass, Sparkles, Globe, Clock, Plane, ShieldCheck,
  CheckCircle2, Share2, Eye, Activity, ChevronRight
} from 'lucide-react';

const FEATURED_DESTINATIONS = [
  {
    id: 'dest-1',
    name: 'Santorini',
    country: 'Greece',
    flag: '🇬🇷',
    tag: 'Romantic Escape',
    color: '#0284c7',
    rating: 4.9,
    costPerDay: 140,
    bestMonth: 'May - Oct',
    imageUrl: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800'
  },
  {
    id: 'dest-2',
    name: 'Kyoto & Osaka',
    country: 'Japan',
    flag: '🇯🇵',
    tag: 'Culture & Temples',
    color: '#db2777',
    rating: 4.8,
    costPerDay: 110,
    bestMonth: 'Mar - May',
    imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800'
  },
  {
    id: 'dest-3',
    name: 'Bali & Ubud',
    country: 'Indonesia',
    flag: '🇮🇩',
    tag: 'Tropical Adventure',
    color: '#059669',
    rating: 4.7,
    costPerDay: 55,
    bestMonth: 'Apr - Sep',
    imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800'
  },
  {
    id: 'dest-4',
    name: 'Paris & Provence',
    country: 'France',
    flag: '🇫🇷',
    tag: 'Art & Gourmet',
    color: '#d97706',
    rating: 4.9,
    costPerDay: 160,
    bestMonth: 'Jun - Sep',
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800'
  },
];

export default function Dashboard({
  trips = [],
  selectedTrip,
  onSelectTrip,
  onOpenCreateTrip,
  onToggleAiAgent,
  onExploreCity,
  onNavigateTab,
  user,
  currencySymbol = '$'
}) {
  const [activeFilter, setActiveFilter] = useState('all');

  const totalBudget = trips.reduce((s, t) => s + (t.budgetLimit || 0), 0);
  const totalStops = trips.reduce((s, t) => s + (t.stops?.length || 0), 0);
  const totalActivities = trips.reduce((s, t) => s + (t.stops || []).reduce((acc, stop) => acc + (stop.activities?.length || 0), 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* 1. Hero Banner with AI & Planning Shortcuts */}
      <div style={{
        background: 'linear-gradient(135deg, #042f2e 0%, #064e3b 40%, #065f46 100%)',
        borderRadius: '24px',
        padding: '36px 40px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 12px 36px -8px rgba(6, 78, 59, 0.4)',
        border: '1px solid rgba(16, 185, 129, 0.2)'
      }}>
        {/* Background glow graphics */}
        <div style={{
          position: 'absolute', top: -50, right: -50,
          width: '260px', height: '260px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', bottom: -30, right: '25%',
          width: '180px', height: '180px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '24px' }}>
          <div style={{ maxWidth: '640px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(16, 185, 129, 0.18)', border: '1px solid rgba(16, 185, 129, 0.35)', borderRadius: '99px', padding: '5px 14px', marginBottom: '14px' }}>
              <Sparkles size={13} color="#34d399" />
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#6ee7b7', letterSpacing: '0.04em' }}>
                INTELLIGENT MULTI-CITY ITINERARY PLANNER
              </span>
            </div>

            <h1 style={{ fontSize: '36px', fontWeight: 900, color: '#ffffff', lineHeight: 1.15, letterSpacing: '-1px', margin: 0 }}>
              Welcome, {user?.name?.split(' ')[0] || 'Traveler'}! ✈️<br />
              <span style={{ background: 'linear-gradient(90deg, #34d399 0%, #fcd34d 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Where would you like to explore next?
              </span>
            </h1>

            <p style={{ fontSize: '14px', color: '#cbd5e1', marginTop: '12px', lineHeight: 1.6, maxWidth: '540px' }}>
              Create day-by-day customized multi-city trips, estimate real-time budgets, discover activities, and share with your travel circle.
            </p>

            {/* Quick Action Pills */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '20px', flexWrap: 'wrap' }}>
              <button
                onClick={() => onToggleAiAgent()}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.25)', borderRadius: '99px',
                  padding: '6px 14px', fontSize: '12px', fontWeight: 700, color: '#ffffff',
                  cursor: 'pointer'
                }}
              >
                ✨ "5 days adventure in Tokyo"
              </button>
              <button
                onClick={() => onToggleAiAgent()}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.25)', borderRadius: '99px',
                  padding: '6px 14px', fontSize: '12px', fontWeight: 700, color: '#ffffff',
                  cursor: 'pointer'
                }}
              >
                ✨ "Romantic Paris & Rome trip"
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Platform Highlights & Statistics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        {[
          { label: 'Active Trips Planned', value: `${trips.length} Trips`, sub: `${totalStops} City stops created`, icon: Plane, bg: '#f0fdf9', border: '#a7f3d0', iconBg: '#0d9488' },
          { label: 'Planned Budget Total', value: `${currencySymbol}${totalBudget.toLocaleString()}`, sub: 'Across your itineraries', icon: DollarSign, bg: '#eff6ff', border: '#bfdbfe', iconBg: '#2563eb' },
          { label: 'Activities Scheduled', value: `${totalActivities} Experiences`, sub: 'Sightseeing, food & tours', icon: Activity, bg: '#faf5ff', border: '#e9d5ff', iconBg: '#7c3aed' },
          { label: 'Collaborative Status', value: '4 Online', sub: 'Real-time sync enabled', icon: Users, bg: '#fffbeb', border: '#fde68a', iconBg: '#d97706' },
        ].map(({ label, value, sub, icon: Icon, bg, border, iconBg }) => (
          <div
            key={label}
            style={{
              background: bg,
              borderRadius: '18px',
              padding: '20px',
              border: `1.5px solid ${border}`,
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
            }}
          >
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b' }}>{label}</div>
              <div style={{ fontSize: '24px', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.5px', marginTop: '4px' }}>
                {value}
              </div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#0d9488', marginTop: '4px' }}>
                {sub}
              </div>
            </div>
            <div style={{
              width: '44px', height: '44px', borderRadius: '12px',
              background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 4px 12px ${iconBg}40`, flexShrink: 0
            }}>
              <Icon size={20} color="#ffffff" strokeWidth={2.2} />
            </div>
          </div>
        ))}
      </div>

      {/* 3. Main Dashboard Workspace: Recent Trips + Quick Launchers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        
        {/* Left: Your Trips Carousel / List */}
        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          padding: '24px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
          display: 'flex', flexDirection: 'column', gap: '16px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                Your Active Itineraries
              </h2>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0' }}>
                Select a trip to continue designing stops and activities
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('trips')}
              style={{
                display: 'flex', alignItems: 'center', gap: '4px',
                background: 'transparent', border: 'none', color: '#0d9488',
                fontSize: '12px', fontWeight: 800, cursor: 'pointer'
              }}
            >
              <span>View All ({trips.length})</span>
              <ChevronRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {trips.length === 0 ? (
              <div style={{ padding: '40px 20px', textAlign: 'center', background: '#f8fafc', borderRadius: '16px', border: '1.5px dashed #cbd5e1' }}>
                <Plane size={32} color="#94a3b8" style={{ margin: '0 auto 10px' }} />
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#334155' }}>No trips created yet</div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>Click "Create Custom Trip" or use "AI Planner" to begin!</div>
                <button
                  onClick={onOpenCreateTrip}
                  style={{
                    marginTop: '14px', background: '#0d9488', color: '#ffffff',
                    border: 'none', borderRadius: '10px', padding: '8px 16px',
                    fontSize: '12px', fontWeight: 700, cursor: 'pointer'
                  }}
                >
                  Create First Trip
                </button>
              </div>
            ) : (
              trips.map((trip) => {
                const isSelected = selectedTrip?.id === trip.id;
                const stopsCount = trip.stops?.length || 0;
                const activitiesCount = (trip.stops || []).reduce((acc, s) => acc + (s.activities?.length || 0), 0);

                return (
                  <div
                    key={trip.id}
                    onClick={() => onSelectTrip(trip)}
                    style={{
                      padding: '16px',
                      borderRadius: '16px',
                      background: isSelected ? '#f0fdf9' : '#ffffff',
                      border: isSelected ? '2px solid #0d9488' : '1px solid #e2e8f0',
                      boxShadow: isSelected ? '0 4px 14px rgba(13,148,136,0.15)' : '0 2px 6px rgba(0,0,0,0.02)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      display: 'flex', gap: '14px', alignItems: 'center'
                    }}
                  >
                    {/* Cover Photo / Emoji */}
                    <div style={{
                      width: '64px', height: '64px', borderRadius: '12px',
                      overflow: 'hidden', flexShrink: 0,
                      background: 'linear-gradient(135deg, #0d9488, #10b981)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      {trip.coverPhoto && trip.coverPhoto.startsWith('http') ? (
                        <img src={trip.coverPhoto} alt={trip.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <span style={{ fontSize: '28px' }}>{trip.coverPhoto || '🗺️'}</span>
                      )}
                    </div>

                    {/* Trip Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                        <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {trip.name}
                        </h3>
                        {trip.isPublic && (
                          <span style={{ fontSize: '10px', fontWeight: 800, color: '#059669', background: '#ecfdf5', padding: '2px 8px', borderRadius: '99px', flexShrink: 0 }}>
                            Public
                          </span>
                        )}
                      </div>

                      {/* Route pills preview */}
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginTop: '6px', flexWrap: 'wrap' }}>
                        {stopsCount > 0 ? (
                          trip.stops.slice(0, 3).map((s, idx) => (
                            <span key={s.id || idx} style={{ fontSize: '11px', fontWeight: 700, color: '#0f766e', background: '#e6fffa', padding: '2px 8px', borderRadius: '6px' }}>
                              {s.city?.name || s.city || 'City'}
                            </span>
                          ))
                        ) : (
                          <span style={{ fontSize: '11px', color: '#94a3b8' }}>No stops added</span>
                        )}
                        {stopsCount > 3 && (
                          <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>+{stopsCount - 3} more</span>
                        )}
                      </div>

                      {/* Details row */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px', fontSize: '11px', color: '#64748b', fontWeight: 600 }}>
                        <span>📅 {trip.startDate || '2026-09-01'}</span>
                        <span>🎯 {activitiesCount} acts</span>
                        <span style={{ color: '#0d9488', fontWeight: 800 }}>💰 {currencySymbol}{trip.budgetLimit?.toLocaleString() || '1,500'}</span>
                      </div>
                    </div>

                    {/* Go to Builder */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectTrip(trip);
                        onNavigateTab('builder');
                      }}
                      style={{
                        padding: '8px 12px', borderRadius: '10px',
                        background: isSelected ? '#0d9488' : '#f1f5f9',
                        color: isSelected ? '#ffffff' : '#334155',
                        border: 'none', fontSize: '12px', fontWeight: 800, cursor: 'pointer',
                        flexShrink: 0
                      }}
                    >
                      Open
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Quick Planner Modules & Tools */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Quick Launch Cards */}
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '24px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: 900, color: '#0f172a', margin: '0 0 16px' }}>
              Travel Toolbox & Explorers
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              {[
                { title: 'Cities Catalog', desc: 'Browse 120+ destinations & costs', tab: 'cities', icon: Globe, color: '#0d9488', bg: '#f0fdf9' },
                { title: 'Activity Directory', desc: 'Discover tours, food & museum tickets', tab: 'activities', icon: Activity, color: '#7c3aed', bg: '#faf5ff' },
                { title: 'Budget Calculator', desc: 'Auto cost breakdowns & category charts', tab: 'budget', icon: DollarSign, color: '#2563eb', bg: '#eff6ff' },
                { title: 'Visual Timeline', desc: 'Day-by-day calendar & transit flow', tab: 'calendar', icon: Calendar, color: '#d97706', bg: '#fffbeb' },
              ].map(({ title, desc, tab, icon: Icon, color, bg }) => (
                <button
                  key={title}
                  onClick={() => onNavigateTab(tab)}
                  style={{
                    background: bg,
                    border: '1px solid transparent',
                    borderRadius: '16px',
                    padding: '16px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    display: 'flex', flexDirection: 'column', gap: '8px'
                  }}
                >
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '10px',
                    background: color, display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <Icon size={18} color="#ffffff" />
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>{title}</div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Current Selected Trip Quick Overview Card */}
          {selectedTrip && (
            <div style={{
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
              borderRadius: '20px',
              padding: '22px 24px',
              color: '#ffffff',
              boxShadow: '0 8px 24px rgba(15, 23, 42, 0.25)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#34d399', letterSpacing: '0.05em' }}>
                  CURRENT ACTIVE TRIP
                </span>
                <button
                  onClick={() => onNavigateTab('itinerary')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '4px',
                    background: 'rgba(255,255,255,0.15)', border: 'none',
                    color: '#ffffff', borderRadius: '8px', padding: '4px 10px',
                    fontSize: '11px', fontWeight: 700, cursor: 'pointer'
                  }}
                >
                  <Eye size={12} /> View Full
                </button>
              </div>

              <h3 style={{ fontSize: '18px', fontWeight: 900, margin: '8px 0 4px' }}>
                {selectedTrip.name}
              </h3>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 16px', lineHeight: 1.5 }}>
                {selectedTrip.description || 'Custom multi-city travel itinerary created with GlobeTrotter.'}
              </p>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => onNavigateTab('builder')}
                  style={{
                    flex: 1, padding: '10px', borderRadius: '10px',
                    background: '#0d9488', color: '#ffffff', border: 'none',
                    fontSize: '12px', fontWeight: 800, cursor: 'pointer'
                  }}
                >
                  Edit Itinerary
                </button>
                <button
                  onClick={() => onNavigateTab('budget')}
                  style={{
                    flex: 1, padding: '10px', borderRadius: '10px',
                    background: 'rgba(255,255,255,0.1)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.2)',
                    fontSize: '12px', fontWeight: 800, cursor: 'pointer'
                  }}
                >
                  View Budget
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. Featured Global Destinations Carousel / Cards */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a', margin: 0 }}>
              Trending Global Destinations
            </h2>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '2px 0 0' }}>
              Hand-picked popular cities with cost ratings and curated activity packages
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('cities')}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: '#ffffff', border: '1.5px solid #cbd5e1',
              borderRadius: '10px', padding: '7px 14px',
              fontSize: '12px', fontWeight: 800, color: '#334155', cursor: 'pointer'
            }}
          >
            <span>Explore All 120+ Cities</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px' }}>
          {FEATURED_DESTINATIONS.map((dest) => (
            <div
              key={dest.id}
              style={{
                background: '#ffffff',
                borderRadius: '20px',
                overflow: 'hidden',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
                display: 'flex', flexDirection: 'column',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}
            >
              {/* Photo Thumbnail */}
              <div style={{ height: '160px', position: 'relative', overflow: 'hidden' }}>
                <img
                  src={dest.imageUrl}
                  alt={dest.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute', top: '12px', left: '12px',
                  background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(8px)',
                  color: '#ffffff', borderRadius: '99px', padding: '4px 10px',
                  fontSize: '11px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px'
                }}>
                  <span>{dest.flag}</span>
                  <span>{dest.country}</span>
                </div>

                <div style={{
                  position: 'absolute', top: '12px', right: '12px',
                  background: '#ffffff', color: '#0f172a',
                  borderRadius: '99px', padding: '4px 8px',
                  fontSize: '11px', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '3px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                }}>
                  <Star size={12} color="#f59e0b" fill="#f59e0b" />
                  <span>{dest.rating}</span>
                </div>
              </div>

              {/* Card Body */}
              <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: dest.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {dest.tag}
                  </span>
                  <h3 style={{ fontSize: '17px', fontWeight: 900, color: '#0f172a', margin: '4px 0 8px' }}>
                    {dest.name}
                  </h3>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#64748b', marginBottom: '14px' }}>
                    <span>Avg {currencySymbol}{dest.costPerDay}/day</span>
                    <span>Best: {dest.bestMonth}</span>
                  </div>
                </div>

                <button
                  onClick={() => onNavigateTab('cities')}
                  style={{
                    width: '100%', padding: '10px', borderRadius: '12px',
                    background: '#f0fdf9', border: '1.5px solid #a7f3d0',
                    color: '#0f766e', fontSize: '12px', fontWeight: 800,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                  }}
                >
                  <span>Plan Trip Here</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
