import React, { useState } from 'react';
import {
  Globe, Plus, Sparkles, Map, LayoutDashboard, List,
  Compass, Activity, Wallet, Calendar, Share2, User,
  Shield, ChevronDown, LogIn, X, Users, MapPin, Search
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'trips', icon: List, label: 'My Trips' },
  { id: 'builder', icon: Map, label: 'Trip Builder' },
  { id: 'itinerary', icon: Compass, label: 'Itinerary View' },
  { id: 'map', icon: MapPin, label: 'Route Map' },
  { id: 'calendar', icon: Calendar, label: 'Timeline' },
  { id: 'budget', icon: Wallet, label: 'Budget Planner' },
  { id: 'cities', icon: Globe, label: 'Explore Cities' },
  { id: 'activities', icon: Activity, label: 'Activities & Tours' },
  { id: 'share', icon: Share2, label: 'Public Showcase' },
  { id: 'admin', icon: Shield, label: 'Admin Console' },
];

export default function Navbar({
  activeTab,
  setActiveTab,
  user,
  onOpenAuth,
  onOpenCreateTrip,
  onToggleAiAgent,
  trips = [],
  selectedTrip,
  onSelectTrip,
  currency = 'INR',
  setCurrency,
  isDarkMode,
  setIsDarkMode,
}) {
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);
  const [showTripPicker, setShowTripPicker] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const currencies = [
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  ];
  const currentSymbol = currencies.find(c => c.code === currency)?.symbol || '₹';

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.05)'
    }}>
      {/* 1. Top Real-Time Collaboration Ticker */}
      <div style={{
        background: 'linear-gradient(90deg, #042f2e 0%, #064e3b 45%, #065f46 100%)',
        color: '#a7f3d0',
        fontSize: '11px',
        fontWeight: 600,
        padding: '5px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <span style={{
              width: '8px', height: '8px', borderRadius: '50%',
              background: '#10b981', display: 'inline-block',
              boxShadow: '0 0 8px #10b981'
            }} />
            <span>🇮🇳 GlobeTrotter India & Global Travel Engine</span>
          </span>
          <span style={{ color: 'rgba(255,255,255,0.4)' }}>|</span>
          <span style={{ color: '#ecfdf5', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Users size={12} /> 4 Planners Collaborating Live
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {selectedTrip && (
            <span style={{ color: '#d1fae5' }}>
              Active Trip: <strong style={{ color: '#ffffff' }}>{selectedTrip.name}</strong>
            </span>
          )}
          <button
            onClick={() => setActiveTab('admin')}
            style={{
              background: 'rgba(255,255,255,0.12)',
              border: 'none',
              color: '#ffffff',
              borderRadius: '6px',
              padding: '2px 8px',
              fontSize: '10px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            ADMIN CONSOLE
          </button>
        </div>
      </div>

      {/* 2. Main Branding & Actions Header */}
      <div style={{ maxWidth: 1440, margin: '0 auto', padding: '10px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          
          {/* Left: Brand & Active Trip Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <button
              onClick={() => setActiveTab('dashboard')}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                background: 'transparent', border: 'none', cursor: 'pointer', padding: 0
              }}
            >
              <div style={{
                width: '40px', height: '40px', borderRadius: '12px',
                background: 'linear-gradient(135deg, #0d9488 0%, #10b981 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(13,148,136,0.35)'
              }}>
                <Globe size={22} color="white" strokeWidth={2.5} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '18px', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.5px', lineHeight: 1.1 }}>
                  GlobeTrotter
                </div>
                <div style={{ fontSize: '10px', color: '#0d9488', fontWeight: 800, letterSpacing: '0.08em', marginTop: '2px' }}>
                  ODDO HACKATHON EDITION
                </div>
              </div>
            </button>

            {/* Quick Trip Switcher */}
            {trips.length > 0 && (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowTripPicker(!showTripPicker)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '7px 12px', borderRadius: '10px',
                    border: '1.5px solid #cbd5e1', background: '#f8fafc',
                    fontSize: '12px', fontWeight: 700, color: '#1e293b',
                    cursor: 'pointer', maxWidth: '200px'
                  }}
                >
                  <MapPin size={13} color="#0d9488" />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {selectedTrip ? selectedTrip.name : 'Switch Trip'}
                  </span>
                  <ChevronDown size={12} color="#64748b" />
                </button>

                {showTripPicker && (
                  <div style={{
                    position: 'absolute', top: '100%', left: 0, marginTop: '6px',
                    background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0',
                    boxShadow: '0 12px 30px rgba(0,0,0,0.15)', padding: '8px', minWidth: '240px', zIndex: 300
                  }}>
                    <div style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8', padding: '4px 8px', textTransform: 'uppercase' }}>
                      Your Itineraries ({trips.length})
                    </div>
                    {trips.map(t => (
                      <button
                        key={t.id}
                        onClick={() => {
                          onSelectTrip(t);
                          setShowTripPicker(false);
                        }}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          width: '100%', textAlign: 'left', padding: '8px 10px', borderRadius: '8px',
                          fontSize: '12px', fontWeight: selectedTrip?.id === t.id ? 800 : 600,
                          background: selectedTrip?.id === t.id ? '#f0fdf9' : 'transparent',
                          color: selectedTrip?.id === t.id ? '#0d9488' : '#334155',
                          border: 'none', cursor: 'pointer'
                        }}
                      >
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.name}</span>
                        {t.isPublic && <span style={{ fontSize: '9px', background: '#ecfdf5', color: '#059669', padding: '2px 6px', borderRadius: '99px' }}>Public</span>}
                      </button>
                    ))}
                    <div style={{ borderTop: '1px solid #f1f5f9', marginTop: '6px', paddingTop: '6px' }}>
                      <button
                        onClick={() => { setShowTripPicker(false); onOpenCreateTrip(); }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '6px', width: '100%',
                          padding: '7px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 700,
                          color: '#0d9488', background: '#f0fdf4', border: 'none', cursor: 'pointer'
                        }}
                      >
                        <Plus size={13} /> + Create New Trip
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right: Actions (Currency, AI Plan, New Trip, User Profile) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            
            {/* Currency Selector (Defaults to INR ₹) */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowCurrencyPicker(!showCurrencyPicker)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '5px',
                  padding: '7px 12px', borderRadius: '10px',
                  border: '1.5px solid #cbd5e1', background: '#ffffff',
                  fontSize: '12px', fontWeight: 800, color: '#1e293b',
                  cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                }}
              >
                <span style={{ color: '#0d9488', fontWeight: 900, fontSize: '13px' }}>{currentSymbol}</span>
                <span>{currency}</span>
                <ChevronDown size={11} color="#64748b" />
              </button>

              {showCurrencyPicker && (
                <div style={{
                  position: 'absolute', top: '100%', right: 0, marginTop: '6px',
                  background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0',
                  boxShadow: '0 12px 28px rgba(0,0,0,0.15)', padding: '6px', minWidth: '160px', zIndex: 300
                }}>
                  <div style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8', padding: '4px 8px', textTransform: 'uppercase' }}>
                    Select Currency
                  </div>
                  {currencies.map(c => (
                    <button
                      key={c.code}
                      onClick={() => { setCurrency(c.code); setShowCurrencyPicker(false); }}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        width: '100%', textAlign: 'left', padding: '8px 12px', borderRadius: '8px',
                        fontSize: '12px', fontWeight: currency === c.code ? 800 : 600,
                        background: currency === c.code ? '#f0fdf9' : 'transparent',
                        color: currency === c.code ? '#0d9488' : '#1e293b',
                        border: 'none', cursor: 'pointer'
                      }}
                    >
                      <span>{c.symbol} {c.code}</span>
                      <span style={{ fontSize: '10px', color: '#64748b' }}>{c.name.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* AI Agent Generator Button */}
            <button
              onClick={onToggleAiAgent}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 14px', borderRadius: '10px',
                background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
                color: '#ffffff', fontSize: '12px', fontWeight: 800,
                boxShadow: '0 3px 12px rgba(124,58,237,0.35)',
                border: 'none', cursor: 'pointer', transition: 'all 0.15s'
              }}
            >
              <Sparkles size={14} />
              <span>AI Trip Planner</span>
            </button>

            {/* Plan New Trip */}
            <button
              onClick={onOpenCreateTrip}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 14px', borderRadius: '10px',
                background: 'linear-gradient(135deg, #0d9488 0%, #10b981 100%)',
                color: '#ffffff', fontSize: '12px', fontWeight: 800,
                boxShadow: '0 3px 12px rgba(13,148,136,0.35)',
                border: 'none', cursor: 'pointer', transition: 'all 0.15s'
              }}
            >
              <Plus size={15} strokeWidth={2.5} />
              <span>+ Create Trip</span>
            </button>

            {/* User Profile / Auth */}
            {user ? (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '3px 8px', borderRadius: '10px',
                    border: '1.5px solid #cbd5e1', background: '#f8fafc',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{
                    width: '26px', height: '26px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #0d9488 0%, #f59e0b 100%)',
                    color: '#ffffff', fontWeight: 900, fontSize: '12px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {user.name?.[0]?.toUpperCase() || 'A'}
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                    {user.name?.split(' ')[0] || 'Traveler'}
                  </span>
                  <ChevronDown size={11} color="#64748b" />
                </button>

                {showUserMenu && (
                  <div style={{
                    position: 'absolute', top: '100%', right: 0, marginTop: '6px',
                    background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0',
                    boxShadow: '0 12px 28px rgba(0,0,0,0.15)', padding: '8px', minWidth: '200px', zIndex: 300
                  }}>
                    <div style={{ padding: '8px 10px', borderBottom: '1px solid #f1f5f9' }}>
                      <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>{user.name || 'Aarav Sharma'}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{user.email || 'traveler@globetrotter.in'}</div>
                    </div>
                    <button
                      onClick={() => { setActiveTab('profile'); setShowUserMenu(false); }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '8px', width: '100%',
                        padding: '8px 10px', fontSize: '12px', fontWeight: 600, color: '#334155',
                        background: 'transparent', border: 'none', cursor: 'pointer', borderRadius: '6px'
                      }}
                    >
                      <User size={14} /> My Profile & Passport
                    </button>
                    <button
                      onClick={() => { setActiveTab('trips'); setShowUserMenu(false); }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '8px', width: '100%',
                        padding: '8px 10px', fontSize: '12px', fontWeight: 600, color: '#334155',
                        background: 'transparent', border: 'none', cursor: 'pointer', borderRadius: '6px'
                      }}
                    >
                      <List size={14} /> All Saved Trips
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                style={{
                  display: 'flex', alignItems: 'center', gap: '5px',
                  padding: '7px 12px', borderRadius: '10px',
                  border: '1.5px solid #cbd5e1', background: '#ffffff',
                  color: '#1e293b', fontSize: '12px', fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                <LogIn size={13} color="#0d9488" strokeWidth={2.5} />
                <span>Login</span>
              </button>
            )}

          </div>
        </div>
      </div>

      {/* 3. Dedicated Horizontal Navigation Strip (Spacious, Clear & Elegant) */}
      <div style={{
        background: '#f8fafc',
        borderTop: '1px solid #e2e8f0',
        padding: '6px 24px'
      }}>
        <div style={{
          maxWidth: 1440, margin: '0 auto',
          display: 'flex', alignItems: 'center', gap: '6px',
          overflowX: 'auto', WebkitOverflowScrolling: 'touch'
        }}>
          {NAV_ITEMS.map(({ id, icon: Icon, label }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  fontSize: '12px',
                  fontWeight: isActive ? 800 : 600,
                  transition: 'all 0.15s ease',
                  background: isActive ? 'linear-gradient(135deg, #0d9488 0%, #10b981 100%)' : '#ffffff',
                  color: isActive ? '#ffffff' : '#475569',
                  boxShadow: isActive ? '0 2px 8px rgba(13,148,136,0.25)' : '0 1px 2px rgba(0,0,0,0.03)',
                  border: isActive ? 'none' : '1px solid #e2e8f0',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer'
                }}
              >
                <Icon size={14} color={isActive ? '#ffffff' : '#0d9488'} strokeWidth={isActive ? 2.5 : 2} />
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </div>

    </header>
  );
}
