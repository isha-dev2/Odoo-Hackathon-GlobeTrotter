import React, { useState } from 'react';
import {
  Globe, Plus, Sparkles, Map, LayoutDashboard, List,
  Compass, Activity, Wallet, Calendar, Share2, User,
  Shield, ChevronDown, LogIn, X, Menu
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Home' },
  { id: 'trips', icon: List, label: 'My Trips' },
  { id: 'builder', icon: Map, label: 'Builder' },
  { id: 'itinerary', icon: Compass, label: 'Itinerary' },
  { id: 'cities', icon: Globe, label: 'Cities' },
  { id: 'activities', icon: Activity, label: 'Activities' },
  { id: 'budget', icon: Wallet, label: 'Budget' },
  { id: 'calendar', icon: Calendar, label: 'Timeline' },
  { id: 'share', icon: Share2, label: 'Share' },
  { id: 'profile', icon: User, label: 'Profile' },
];

export default function Navbar({
  activeTab, setActiveTab, user, onOpenAuth, onOpenCreateTrip,
  onToggleAiAgent, currency, setCurrency, isDarkMode, setIsDarkMode,
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);

  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'INR'];
  const currencySymbols = { USD: '$', EUR: '€', GBP: '£', JPY: '¥', INR: '₹' };

  return (
    <>
      {/* Top Bar */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid #e8f0ef',
        boxShadow: '0 1px 8px rgba(0,0,0,0.04)'
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', height: 60, gap: 16 }}>
            {/* Logo */}
            <button
              onClick={() => setActiveTab('dashboard')}
              style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'linear-gradient(135deg, #0d9488, #10b981)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(13,148,136,0.3)'
              }}>
                <Globe size={18} color="white" strokeWidth={2.5} />
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px', lineHeight: 1 }}>GlobeTrotter</div>
                <div style={{ fontSize: 10, color: '#0d9488', fontWeight: 600, letterSpacing: '0.05em', lineHeight: 1 }}>TRAVEL PLANNER</div>
              </div>
            </button>

            {/* Center Nav */}
            <nav style={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, justifyContent: 'center', flexWrap: 'nowrap', overflow: 'hidden' }}>
              {NAV_ITEMS.map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    padding: '6px 10px',
                    borderRadius: 8,
                    fontSize: 12, fontWeight: 600,
                    transition: 'all 0.15s',
                    background: activeTab === id ? 'linear-gradient(135deg, #0d9488, #10b981)' : 'transparent',
                    color: activeTab === id ? 'white' : '#64748b',
                    boxShadow: activeTab === id ? '0 2px 8px rgba(13,148,136,0.25)' : 'none',
                    whiteSpace: 'nowrap',
                    border: 'none', cursor: 'pointer'
                  }}
                >
                  <Icon size={13} />
                  <span style={{ display: 'none' }} className="xl:inline">{label}</span>
                </button>
              ))}
            </nav>

            {/* Right Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              {/* Currency */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowCurrencyPicker(!showCurrencyPicker)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    padding: '6px 10px', borderRadius: 8,
                    border: '1.5px solid #e2e8f0', background: 'white',
                    fontSize: 12, fontWeight: 700, color: '#374151',
                    cursor: 'pointer'
                  }}
                >
                  <span>{currencySymbols[currency]}</span>
                  <span>{currency}</span>
                  <ChevronDown size={11} color="#94a3b8" />
                </button>
                {showCurrencyPicker && (
                  <div style={{
                    position: 'absolute', top: '100%', right: 0, marginTop: 4,
                    background: 'white', borderRadius: 12, border: '1px solid #e2e8f0',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)', padding: 6, minWidth: 100, zIndex: 200
                  }}>
                    {currencies.map(c => (
                      <button key={c} onClick={() => { setCurrency(c); setShowCurrencyPicker(false); }}
                        style={{
                          display: 'block', width: '100%', textAlign: 'left',
                          padding: '7px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                          background: currency === c ? '#f0fdf9' : 'transparent',
                          color: currency === c ? '#0d9488' : '#374151',
                          border: 'none', cursor: 'pointer'
                        }}
                      >
                        {currencySymbols[c]} {c}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* AI Agent Button */}
              <button
                onClick={onToggleAiAgent}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '7px 13px', borderRadius: 10,
                  background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                  color: 'white', fontSize: 12, fontWeight: 700,
                  boxShadow: '0 4px 12px rgba(124,58,237,0.3)',
                  border: 'none', cursor: 'pointer', transition: 'all 0.15s'
                }}
              >
                <Sparkles size={13} />
                <span>AI Plan</span>
              </button>

              {/* New Trip */}
              <button
                onClick={onOpenCreateTrip}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '7px 13px', borderRadius: 10,
                  background: 'linear-gradient(135deg, #0d9488, #10b981)',
                  color: 'white', fontSize: 12, fontWeight: 700,
                  boxShadow: '0 4px 12px rgba(13,148,136,0.3)',
                  border: 'none', cursor: 'pointer', transition: 'all 0.15s'
                }}
              >
                <Plus size={13} />
                <span>New Trip</span>
              </button>

              {/* User / Login */}
              {user ? (
                <button
                  onClick={() => setActiveTab('profile')}
                  style={{
                    width: 34, height: 34, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #0d9488, #f59e0b)',
                    color: 'white', fontWeight: 800, fontSize: 13,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: 'none', cursor: 'pointer', flexShrink: 0
                  }}
                >
                  {user.name?.[0]?.toUpperCase() || 'U'}
                </button>
              ) : (
                <button
                  onClick={onOpenAuth}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    padding: '7px 13px', borderRadius: 10,
                    border: '1.5px solid #e2e8f0', background: 'white',
                    color: '#374151', fontSize: 12, fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <LogIn size={13} />
                  <span>Login</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
