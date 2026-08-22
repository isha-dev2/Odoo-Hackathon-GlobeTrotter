import React, { useState } from 'react';
import {
  User, Mail, Globe, Heart, Shield, LogOut,
  Save, Check, MapPin, Compass, Sparkles, Award,
  CreditCard, Download, CheckCircle2, QrCode, FileText
} from 'lucide-react';
import { downloadInvoice } from '../utils/invoiceGenerator';

export default function UserProfile({
  user,
  trips = [],
  currency,
  setCurrency,
  onUpdateUser,
  onLogout,
  onNavigateTab,
  bookings = [],
  currencySymbol = '₹'
}) {
  const [name, setName] = useState(user?.name || 'Aarav Sharma');
  const [email, setEmail] = useState(user?.email || 'aarav.sharma@odoo-hackathon.in');
  const [bio, setBio] = useState('Passionate traveler, heritage lover, and culinary enthusiast exploring cultural gems across India and global cities.');
  const [travelStyle, setTravelStyle] = useState(['Royal Heritage', 'Backwaters & Nature', 'Beach Getaway', 'Culinary Tours']);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sample default confirmed bookings if none yet
  const defaultBookings = bookings.length > 0 ? bookings : [
    {
      id: 'bk-sample-1',
      bookingRef: 'GT-BK-892145',
      transactionId: 'txn_9824fha91823',
      itemName: 'Royal Rajasthan Multi-City Heritage Package',
      amount: 45000,
      currency: 'INR',
      paymentMethod: 'UPI (Google Pay)',
      travelerName: name,
      travelerEmail: email,
      bookedAt: '2026-08-20T10:30:00Z',
      status: 'CONFIRMED'
    }
  ];

  const wishlistCities = [
    { name: 'Munnar & Alleppey', country: 'Kerala, India', flag: '🇮🇳', tag: 'Tea Hills & Houseboats' },
    { name: 'Dubai & Abu Dhabi', country: 'UAE', flag: '🇦🇪', tag: 'Desert Safari & Luxury' },
    { name: 'Manali & Ladakh', country: 'Himachal, India', flag: '🇮🇳', tag: 'Snow Peaks & Paragliding' },
  ];

  const handleSave = (e) => {
    e.preventDefault();
    if (onUpdateUser) onUpdateUser({ ...user, name, email, bio });
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
            {name[0]?.toUpperCase() || 'A'}
          </div>

          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 900, color: '#ffffff', margin: 0, letterSpacing: '-0.5px' }}>
              {name}
            </h1>
            <p style={{ fontSize: '13px', color: '#cbd5e1', margin: '4px 0 0' }}>
              {email} · Verified Traveler · Odoo Hackathon Participant
            </p>
          </div>
        </div>
      </div>

      {/* Confirmed Online Bookings & GST Invoices Section */}
      <div style={{
        background: '#ffffff', borderRadius: '24px', padding: '28px',
        border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
              <CreditCard size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                My Confirmed Bookings & Invoices ({defaultBookings.length})
              </h3>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0' }}>
                Instant travel vouchers, payment transaction IDs, and downloadable GST tax receipts
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {defaultBookings.map(bk => (
            <div
              key={bk.bookingRef || bk.id}
              style={{
                background: '#f8fafc', borderRadius: '16px', padding: '18px 22px',
                border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '15px', fontWeight: 900, color: '#0f172a' }}>{bk.itemName}</span>
                  <span style={{ fontSize: '10px', fontWeight: 800, background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '99px' }}>
                    ● CONFIRMED
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                  Ref: <strong style={{ color: '#0d9488' }}>{bk.bookingRef}</strong> · Method: {bk.paymentMethod} · Txn: <code>{bk.transactionId}</code>
                </div>
                <div style={{ fontSize: '13px', fontWeight: 900, color: '#0f172a', marginTop: '6px' }}>
                  Amount Paid: <span style={{ color: '#0d9488' }}>{currencySymbol}{bk.amount?.toLocaleString()}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => downloadInvoice(bk)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  background: '#ffffff', border: '1.5px solid #cbd5e1',
                  borderRadius: '12px', padding: '9px 16px',
                  fontSize: '12px', fontWeight: 800, color: '#0f172a',
                  cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
                }}
              >
                <Download size={14} color="#0d9488" />
                <span>Download Tax Invoice</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid: Profile Settings + Travel Passport */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        
        {/* Left: Profile Form */}
        <div style={{
          background: '#ffffff', borderRadius: '24px', padding: '28px',
          border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#0f172a', margin: '0 0 18px' }}>
            Profile Settings
          </h3>

          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', display: 'block', marginBottom: '6px' }}>FULL NAME</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                style={{ width: '100%', background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '12px', padding: '10px 14px', fontSize: '13px', fontWeight: 600, color: '#0f172a', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', display: 'block', marginBottom: '6px' }}>EMAIL ADDRESS</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{ width: '100%', background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '12px', padding: '10px 14px', fontSize: '13px', fontWeight: 600, color: '#0f172a', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', display: 'block', marginBottom: '6px' }}>BIO & TRAVEL GOALS</label>
              <textarea
                rows={3}
                value={bio}
                onChange={e => setBio(e.target.value)}
                style={{ width: '100%', background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '12px', padding: '10px 14px', fontSize: '13px', fontWeight: 600, color: '#0f172a', outline: 'none', resize: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
              <button
                type="submit"
                style={{
                  flex: 1, padding: '12px', borderRadius: '12px',
                  background: 'linear-gradient(135deg, #0d9488 0%, #10b981 100%)',
                  color: '#ffffff', border: 'none', fontSize: '13px', fontWeight: 800,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                }}
              >
                {savedSuccess ? <Check size={16} /> : <Save size={16} />}
                <span>{savedSuccess ? 'Saved Successfully!' : 'Save Profile Changes'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right: Travel Passport Achievements & Wishlist */}
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
                <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, marginTop: '2px' }}>Passport Stamps</div>
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
                onClick={() => onNavigateTab && onNavigateTab('cities')}
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
                    onClick={() => onNavigateTab && onNavigateTab('cities')}
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
