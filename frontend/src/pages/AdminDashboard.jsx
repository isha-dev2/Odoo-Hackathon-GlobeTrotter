import React, { useState } from 'react';
import {
  Shield, Users, Compass, Globe, DollarSign, TrendingUp,
  Activity, CheckCircle, Database, Server, RefreshCw, Star,
  CreditCard, Smartphone, Download, CheckCircle2
} from 'lucide-react';
import { MOCK_CITIES } from '../api/client';
import { downloadInvoice } from '../utils/invoiceGenerator';

export default function AdminDashboard({ trips = [], currencySymbol = '₹' }) {
  const [activeTab, setActiveTab] = useState('metrics');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const totalUsers = 1840;
  const totalTrips = trips.length + 940;
  const topCities = MOCK_CITIES.slice(0, 6);

  const sampleTransactions = [
    {
      id: 'txn-1',
      bookingRef: 'GT-BK-892145',
      traveler: 'Aarav Sharma',
      service: 'Royal Rajasthan Multi-City Heritage Package',
      amount: 45000,
      method: 'UPI (Google Pay)',
      status: 'CONFIRMED',
      date: '2026-08-22 14:30'
    },
    {
      id: 'txn-2',
      bookingRef: 'GT-BK-781923',
      traveler: 'Priya Patel',
      service: 'Kerala Backwaters Houseboat Cruise',
      amount: 38000,
      method: 'PhonePe UPI',
      status: 'CONFIRMED',
      date: '2026-08-22 13:15'
    },
    {
      id: 'txn-3',
      bookingRef: 'GT-BK-654120',
      traveler: 'Rohan Mehra',
      service: 'Goa Dudhsagar Waterfall Safari',
      amount: 4400,
      method: 'Credit Card (HDFC)',
      status: 'CONFIRMED',
      date: '2026-08-22 11:45'
    },
    {
      id: 'txn-4',
      bookingRef: 'GT-BK-432190',
      traveler: 'Neha Gupta',
      service: 'Dubai Luxury Desert Safari & Burj Khalifa VIP',
      amount: 125000,
      method: 'Net Banking (SBI)',
      status: 'CONFIRMED',
      date: '2026-08-22 09:20'
    }
  ];

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
                ADMIN PLATFORM REVENUE & CONTROL CONSOLE
              </span>
            </div>

            <h1 style={{ fontSize: '32px', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.5px', margin: 0 }}>
              Platform Analytics & Payment Telemetry
            </h1>

            <p style={{ fontSize: '14px', color: '#cbd5e1', marginTop: '8px' }}>
              Live revenue monitoring, online booking success rate, database connection pool, and destination rankings.
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

      {/* Top 4 Stat Cards including Gross Revenue */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '18px' }}>
        <div style={{ background: '#ffffff', padding: '22px', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#64748b' }}>GROSS BOOKINGS (GMV)</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
              <CreditCard size={18} />
            </div>
          </div>
          <div style={{ fontSize: '26px', fontWeight: 900, color: '#0f172a', marginTop: '10px' }}>
            {currencySymbol}24,85,000
          </div>
          <div style={{ fontSize: '11px', color: '#059669', fontWeight: 700, marginTop: '4px' }}>
            ↑ 24.8% growth this week
          </div>
        </div>

        <div style={{ background: '#ffffff', padding: '22px', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#64748b' }}>TOTAL TRAVELERS</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
              <Users size={18} />
            </div>
          </div>
          <div style={{ fontSize: '26px', fontWeight: 900, color: '#0f172a', marginTop: '10px' }}>
            {totalUsers.toLocaleString()}
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, marginTop: '4px' }}>
            Active registered accounts
          </div>
        </div>

        <div style={{ background: '#ffffff', padding: '22px', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#64748b' }}>PAYMENT SUCCESS RATE</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#faf5ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7c3aed' }}>
              <CheckCircle size={18} />
            </div>
          </div>
          <div style={{ fontSize: '26px', fontWeight: 900, color: '#0f172a', marginTop: '10px' }}>
            99.4%
          </div>
          <div style={{ fontSize: '11px', color: '#059669', fontWeight: 700, marginTop: '4px' }}>
            UPI & Card Gateway Healthy
          </div>
        </div>

        <div style={{ background: '#ffffff', padding: '22px', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#64748b' }}>ITINERARIES GENERATED</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#fffbeb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706' }}>
              <Compass size={18} />
            </div>
          </div>
          <div style={{ fontSize: '26px', fontWeight: 900, color: '#0f172a', marginTop: '10px' }}>
            {totalTrips.toLocaleString()}
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, marginTop: '4px' }}>
            Multi-city plans created
          </div>
        </div>
      </div>

      {/* Live Online Transactions Table */}
      <div style={{
        background: '#ffffff', borderRadius: '24px', padding: '28px',
        border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#0f172a', margin: 0 }}>
              Live Booking & Payment Transactions
            </h3>
            <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0' }}>
              Real-time settlement stream across UPI, Net Banking, and Credit Cards
            </p>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                <th style={{ padding: '12px 14px', color: '#64748b', fontWeight: 800, fontSize: '11px' }}>BOOKING REF</th>
                <th style={{ padding: '12px 14px', color: '#64748b', fontWeight: 800, fontSize: '11px' }}>TRAVELER</th>
                <th style={{ padding: '12px 14px', color: '#64748b', fontWeight: 800, fontSize: '11px' }}>SERVICE / ITINERARY</th>
                <th style={{ padding: '12px 14px', color: '#64748b', fontWeight: 800, fontSize: '11px' }}>PAYMENT METHOD</th>
                <th style={{ padding: '12px 14px', color: '#64748b', fontWeight: 800, fontSize: '11px' }}>AMOUNT</th>
                <th style={{ padding: '12px 14px', color: '#64748b', fontWeight: 800, fontSize: '11px' }}>STATUS</th>
                <th style={{ padding: '12px 14px', color: '#64748b', fontWeight: 800, fontSize: '11px' }}>INVOICE</th>
              </tr>
            </thead>
            <tbody>
              {sampleTransactions.map(txn => (
                <tr key={txn.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px', fontWeight: 800, color: '#0d9488' }}>{txn.bookingRef}</td>
                  <td style={{ padding: '14px', fontWeight: 700, color: '#0f172a' }}>{txn.traveler}</td>
                  <td style={{ padding: '14px', color: '#334155' }}>{txn.service}</td>
                  <td style={{ padding: '14px', color: '#64748b' }}>{txn.method}</td>
                  <td style={{ padding: '14px', fontWeight: 900, color: '#0f172a' }}>{currencySymbol}{txn.amount.toLocaleString()}</td>
                  <td style={{ padding: '14px' }}>
                    <span style={{ fontSize: '10px', fontWeight: 800, background: '#dcfce7', color: '#15803d', padding: '3px 8px', borderRadius: '99px' }}>
                      ● {txn.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px' }}>
                    <button
                      onClick={() => downloadInvoice(txn)}
                      style={{ background: '#f0fdf9', border: '1px solid #a7f3d0', borderRadius: '8px', padding: '4px 10px', fontSize: '11px', fontWeight: 800, color: '#0f766e', cursor: 'pointer' }}
                    >
                      Receipt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Database & Server Health Telemetry */}
      <div style={{
        background: '#ffffff', borderRadius: '24px', padding: '28px',
        border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#0f172a', margin: '0 0 16px' }}>
          Database Connection & Infrastructure Health
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Database size={16} color="#0d9488" />
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>PostgreSQL Pool</span>
            </div>
            <div style={{ fontSize: '12px', color: '#16a34a', fontWeight: 700, marginTop: '6px' }}>
              ● 10/10 Connections Active (0.8ms latency)
            </div>
          </div>

          <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Server size={16} color="#7c3aed" />
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>Prisma ORM Engine</span>
            </div>
            <div style={{ fontSize: '12px', color: '#16a34a', fontWeight: 700, marginTop: '6px' }}>
              ● Schema Synchronized (v5.22.0)
            </div>
          </div>

          <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CreditCard size={16} color="#059669" />
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>Payment Gateway Webhooks</span>
            </div>
            <div style={{ fontSize: '12px', color: '#16a34a', fontWeight: 700, marginTop: '6px' }}>
              ● Razorpay & UPI Webhook Listening (Port 5000)
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
