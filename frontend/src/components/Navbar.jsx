import React, { useState } from 'react';
import {
  Globe, Plus, Sparkles, Map, LayoutDashboard, List,
  Compass, Activity, Wallet, Calendar, Share2, User,
  Shield, ChevronDown, LogIn, X, Menu, Users, ExternalLink,
  Sun, Moon, MapPin
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'trips', icon: List, label: 'My Trips' },
  { id: 'builder', icon: Map, label: 'Trip Builder' },
  { id: 'itinerary', icon: Compass, label: 'Itinerary View' },
  { id: 'cities', icon: Globe, label: 'Cities' },
  { id: 'activities', icon: Activity, label: 'Activities' },
  { id: 'budget', icon: Wallet, label: 'Budget' },
  { id: 'calendar', icon: Calendar, label: 'Timeline' },
  { id: 'map', icon: MapPin, label: 'World Map' },
  { id: 'share', icon: Share2, label: 'Public Share' },
  { id: 'admin', icon: Shield, label: 'Admin' },
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
  currency,
  setCurrency,
  isDarkMode,
  setIsDarkMode,
  onExportTrip,
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);
  const [showTripPicker, setShowTripPicker] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  ];
  const currentSymbol = currencies.find(c => c.code === currency)?.symbol || '$';

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.06)'
    }}>
      {/* Top Utility Ticker / Live Collaboration Bar */}
      <div style={{
        background: 'linear-gradient(90deg, #042f2e 0%, #064e3b 50%, #065f46 100%)',
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
            <span>GlobeTrotter Multi-City Engine Active</span>
          </span>
          <span style={{ color: 'rgba(255,255,255,0.4)' }}>|</span>
          <span style={{ color: '#ecfdf5', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Users size={12} /> 4 Planners Online
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {selectedTrip && (
            <span style={{ color: '#d1fae5', display: 'none' }} className="md:inline">
              Editing: <strong style={{ color: '#ffffff' }}>{selectedTrip.name}</strong>
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

      {/* Main Navigation Header */}
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', height: '68px', gap: '16px', justifyContent: 'space-between' }}>
          
          {/* Logo & Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
            <button
              onClick={() => setActiveTab('dashboard')}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                background: 'transparent', border: 'none', cursor: 'pointer', padding: 0
              }}
            >
              <div style={{
                width: '42px', height: '42px', borderRadius: '12px',
                background: 'linear-gradient(135deg, #0d9488 0%, #10b981 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(13,148,136,0.35)'
              }}>
                <Globe size={22} color="white" strokeWidth={2.5} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '18px', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.5px', lineHeight: 1.1 }}>
                  GlobeTrotter
                </div>
                <div style={{ fontSize: '10px', color: '#0d9488', fontWeight: 800, letterSpacing: '0.08em', marginTop: '2px' }}>
                  TRAVEL PLANNER
                </div>
              </div>
            </button>

            {/* Quick Trip Selector Dropdown */}
            {trips.length > 0 && (
              <div style={{ position: 'relative', display: 'none' }} className="lg:block">
                <button
                  onClick={() => setShowTripPicker(!showTripPicker)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '6px 12px', borderRadius: '10px',
                    border: '1.5px solid #e2e8f0', background: '#f8fafc',
                    fontSize: '12px', fontWeight: 700, color: '#334155',
                    cursor: 'pointer', maxWidth: '180px'
                  }}
                >
                  <MapPin size={13} color="#0d9488" />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {selectedTrip ? selectedTrip.name : 'Select Trip'}
                  </span>
                  <ChevronDown size={12} color="#64748b" />
                </button>

                {showTripPicker && (
                  <div style={{
                    position: 'absolute', top: '100%', left: 0, marginTop: '6px',
                    background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0',
                    boxShadow: '0 12px 30px rgba(0,0,0,0.15)', padding: '8px', minWidth: '220px', zIndex: 300
                  }}>
                    <div style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8', padding: '4px 8px', textTransform: 'uppercase' }}>
                      Your Trips ({trips.length})
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
                        <Plus size={13} /> Create New Trip
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Desktop Center Navigation Bar with Clear Readable Text & Icons */}
          <nav style={{
            display: 'none',
            alignItems: 'center',
            gap: '4px',
            background: '#f8fafc',
            padding: '5px',
            borderRadius: '14px',
            border: '1px solid #e2e8f0',
            overflowX: 'auto'
          }} className="md:flex">
            {NAV_ITEMS.map(({ id, icon: Icon, label }) => {
              const isActive = activeTab === id;
              return (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    fontSize: '12px',
                    fontWeight: isActive ? 800 : 600,
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    background: isActive ? 'linear-gradient(135deg, #0d9488 0%, #10b981 100%)' : 'transparent',
                    color: isActive ? '#ffffff' : '#475569',
                    boxShadow: isActive ? '0 4px 12px rgba(13,148,136,0.3)' : 'none',
                    whiteSpace: 'nowrap',
                    border: 'none', cursor: 'pointer'
                  }}
                >
                  <Icon size={15} color={isActive ? '#ffffff' : '#64748b'} strokeWidth={isActive ? 2.5 : 2} />
                  <span>{label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            {/* Currency Selector Dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowCurrencyPicker(!showCurrencyPicker)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '5px',
                  padding: '7px 11px', borderRadius: '10px',
                  border: '1.5px solid #cbd5e1', background: '#ffffff',
                  fontSize: '12px', fontWeight: 800, color: '#1e293b',
                  cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                }}
              >
                <span style={{ color: '#0d9488', fontWeight: 900 }}>{currentSymbol}</span>
                <span>{currency}</span>
                <ChevronDown size={12} color="#64748b" />
              </button>

              {showCurrencyPicker && (
                <div style={{
                  position: 'absolute', top: '100%', right: 0, marginTop: '6px',
                  background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0',
                  boxShadow: '0 12px 28px rgba(0,0,0,0.15)', padding: '6px', minWidth: '150px', zIndex: 300
                }}>
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
                      <span style={{ fontSize: '10px', color: '#94a3b8' }}>{c.name.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* AI Agent Button */}
            <button
              onClick={onToggleAiAgent}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 14px', borderRadius: '12px',
                background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
                color: '#ffffff', fontSize: '12px', fontWeight: 800,
                boxShadow: '0 4px 14px rgba(124,58,237,0.35)',
                border: 'none', cursor: 'pointer', transition: 'all 0.2s'
              }}
            >
              <Sparkles size={14} />
              <span style={{ display: 'none' }} className="sm:inline">AI Planner</span>
            </button>

            {/* Plan New Trip */}
            <button
              onClick={onOpenCreateTrip}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 14px', borderRadius: '12px',
                background: 'linear-gradient(135deg, #0d9488 0%, #10b981 100%)',
                color: '#ffffff', fontSize: '12px', fontWeight: 800,
                boxShadow: '0 4px 14px rgba(13,148,136,0.35)',
                border: 'none', cursor: 'pointer', transition: 'all 0.2s'
              }}
            >
              <Plus size={15} strokeWidth={2.5} />
              <span style={{ display: 'none' }} className="sm:inline">New Trip</span>
            </button>

            {/* User Profile / Auth Button */}
            {user ? (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '3px', borderRadius: '99px',
                    border: '2px solid #0d9488', background: 'transparent',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #0d9488 0%, #f59e0b 100%)',
                    color: '#ffffff', fontWeight: 900, fontSize: '13px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {user.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                </button>

                {showUserMenu && (
                  <div style={{
                    position: 'absolute', top: '100%', right: 0, marginTop: '8px',
                    background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0',
                    boxShadow: '0 12px 28px rgba(0,0,0,0.15)', padding: '8px', minWidth: '180px', zIndex: 300
                  }}>
                    <div style={{ padding: '8px 10px', borderBottom: '1px solid #f1f5f9' }}>
                      <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>{user.name || 'Traveler'}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{user.email || 'user@globetrotter.io'}</div>
                    </div>
                    <button
                      onClick={() => { setActiveTab('profile'); setShowUserMenu(false); }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '8px', width: '100%',
                        padding: '8px 10px', fontSize: '12px', fontWeight: 600, color: '#334155',
                        background: 'transparent', border: 'none', cursor: 'pointer', borderRadius: '6px'
                      }}
                    >
                      <User size={14} /> My Profile & Wishlist
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
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '8px 14px', borderRadius: '12px',
                  border: '1.5px solid #cbd5e1', background: '#ffffff',
                  color: '#1e293b', fontSize: '12px', fontWeight: 800,
                  cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                }}
              >
                <LogIn size={14} color="#0d9488" strokeWidth={2.5} />
                <span>Login</span>
              </button>
            )}

            {/* Mobile Navigation Toggle Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '36px', height: '36px', borderRadius: '10px',
                border: '1px solid #cbd5e1', background: '#ffffff',
                color: '#334155', cursor: 'pointer'
              }}
              className="md:hidden"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {mobileOpen && (
        <div style={{
          background: '#ffffff', borderTop: '1px solid #e2e8f0',
          padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '6px'
        }} className="md:hidden">
          {NAV_ITEMS.map(({ id, icon: Icon, label }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => { setActiveTab(id); setMobileOpen(false); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '10px 14px', borderRadius: '10px',
                  fontSize: '13px', fontWeight: isActive ? 800 : 600,
                  background: isActive ? 'linear-gradient(135deg, #0d9488 0%, #10b981 100%)' : '#f8fafc',
                  color: isActive ? '#ffffff' : '#334155',
                  border: 'none', textAlign: 'left', cursor: 'pointer'
                }}
              >
                <Icon size={17} color={isActive ? '#ffffff' : '#0d9488'} />
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
