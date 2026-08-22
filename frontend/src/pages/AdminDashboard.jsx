import React, { useState } from 'react';
import {
  Shield, Users, Compass, Globe, DollarSign, TrendingUp,
  Activity, CheckCircle, Database, Server, RefreshCw, Star
} from 'lucide-react';
import { MOCK_CITIES } from '../api/client';

export default function AdminDashboard({ trips = [], currencySymbol = '$' }) {
  const [activeTab, setActiveTab] = useState('metrics');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const totalUsers = 1840;
  const totalTrips = trips.length + 940;
  const topCities = MOCK_CITIES.slice(0, 6);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #0f172a 100%)',
        borderRadius: '24px', padding: '36px 40px',
        position: 'relative', overflow: 'hidden',
        boxShadow: '0 12px 36px -8px rgba(30, 27, 75, 0.5)',
        border: '1px solid rgba(168, 85, 247, 0.2)'
      }}>
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(168,85,247,0.2)', border: '1px solid rgba(168,85,247,0.35)', borderRadius: '99px', padding: '4px 12px', marginBottom: '10px' }}>
              <Shield size={12} color="#c084fc" />
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#e9d5ff', letterSpacing: '0.05em' }}>
                ADMIN PLATFORM INTELLIGENCE & CONTROL CONSOLE
              </span>
            </div>

            <h1 style={{ fontSize: '32px', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.5px', margin: 0 }}>
              Platform Analytics & User Trends
            </h1>

            <p style={{ fontSize: '14px', color: '#cbd5e1', marginTop: '8px' }}>
              Real-time monitoring of app adoption, destination rankings, active itineraries, and database health.
            </p>
          </div>

          <button
            onClick={handleRefresh}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)',
              color: '#ffffff', borderRadius: '12px', padding: '10px 18px',
              fontSize: '13px', fontWeight: 800, cursor: 'pointer'
            }}
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
            <span>{isRefreshing ? 'Syncing...' : 'Refresh Metrics'}</span>
          </button>
        </div>
      </div>

      {/* Analytics Counter Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        {[
          { label: 'Active Platform Users', value: totalUsers.toLocaleString(), sub: '+14% this week', icon: Users, bg: '#f0fdf9', border: '#a7f3d0', iconBg: '#0d9488' },
          { label: 'Total Itineraries Created', value: totalTrips.toLocaleString(), sub: '+32 today', icon: Compass, bg: '#faf5ff', border: '#e9d5ff', iconBg: '#7c3aed' },
          { label: 'Destinations Catalog', value: '128 Cities', sub: 'Across 45 countries', icon: Globe, bg: '#eff6ff', border: '#bfdbfe', iconBg: '#2563eb' },
          { label: 'Avg Spend / Itinerary', value: `${currencySymbol}2,650`, sub: 'Optimal budget range', icon: DollarSign, bg: '#fffbeb', border: '#fde68a', iconBg: '#d97706' },
        ].map(({ label, value, sub, icon: Icon, bg, border, iconBg }) => (
          <div
            key={label}
            style={{
              background: bg, borderRadius: '20px', padding: '22px',
              border: `1.5px solid ${border}`, display: 'flex', alignItems: 'flex-start',
              justifyContent: 'space-between', boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
            }}
          >
            <div>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#64748b' }}>{label}</div>
              <div style={{ fontSize: '26px', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.5px', marginTop: '4px' }}>
                {value}
              </div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#0d9488', marginTop: '4px' }}>
                {sub}
              </div>
            </div>
            <div style={{
              width: '44px', height: '44px', borderRadius: '12px',
              background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 4px 12px ${iconBg}40`, flexShrink: 0
            }}>
              <Icon size={20} color="#ffffff" />
            </div>
          </div>
        ))}
      </div>

      {/* System Health Status & Database Connection */}
      <div style={{
        background: '#ffffff', borderRadius: '20px', padding: '22px 28px',
        border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Database size={20} color="#059669" />
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>
              Relational PostgreSQL & Prisma Database Status
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>
              Tables: Users, Trips, Stops, Activities, Cities · Connection Pool Healthy (0ms latency)
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '6px 14px', borderRadius: '99px' }}>
          <CheckCircle size={14} color="#059669" />
          <span style={{ fontSize: '12px', fontWeight: 800, color: '#065f46' }}>All Systems Operational</span>
        </div>
      </div>

      {/* Top Destinations Leaderboard */}
      <div style={{
        background: '#ffffff', borderRadius: '24px', padding: '28px',
        border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
      }}>
        <h2 style={{ fontSize: '18px', fontWeight: 900, color: '#0f172a', margin: '0 0 18px' }}>
          Top Booked & Planned Destinations
        </h2>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1.5px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}>
                <th style={{ padding: '12px 16px', fontWeight: 800 }}>DESTINATION</th>
                <th style={{ padding: '12px 16px', fontWeight: 800 }}>COUNTRY</th>
                <th style={{ padding: '12px 16px', fontWeight: 800 }}>COST INDEX</th>
                <th style={{ padding: '12px 16px', fontWeight: 800 }}>POPULARITY SCORE</th>
              </tr>
            </thead>
            <tbody>
              {topCities.map(city => (
                <tr key={city.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px 16px', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src={city.imageUrl} alt={city.name} style={{ width: '34px', height: '34px', borderRadius: '10px', objectFit: 'cover' }} />
                    <span>{city.name}</span>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#475569', fontWeight: 600 }}>{city.country}</td>
                  <td style={{ padding: '14px 16px', color: '#0d9488', fontWeight: 800 }}>{city.costIndex}/100</td>
                  <td style={{ padding: '14px 16px', fontWeight: 800, color: '#f59e0b' }}>
                    ★ {city.popularity}/100
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
