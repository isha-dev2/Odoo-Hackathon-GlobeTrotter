import React from 'react';
import { DollarSign, PieChart, Hotel, Plane, Coffee, ShieldCheck, TrendingUp } from 'lucide-react';

export default function BudgetSummary({ cities, currency = 'USD' }) {
  const currencySymbol = currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : currency === 'INR' ? '₹' : '$';

  const totalStayDays = cities.reduce((acc, c) => acc + c.days, 0);
  const totalHotelCost = cities.reduce((acc, c) => acc + (c.days * c.costPerNight), 0);
  const totalTransportCost = cities.reduce((acc, c) => acc + (c.transportToNext?.cost || 0), 0);
  const estimatedFoodCost = totalStayDays * 50; // $50/day food/excursions avg
  const grandTotal = totalHotelCost + totalTransportCost + estimatedFoodCost;

  const budgetCap = 3500;
  const percentage = Math.min(100, Math.round((grandTotal / budgetCap) * 100));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Total Cost Banner */}
      <div className="glass-card" style={{ padding: '1.75rem', background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', color: '#FFFFFF' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF' }}>Trip Budget Estimator & Analytics</h3>
            <p style={{ fontSize: '0.85rem', color: '#94A3B8' }}>Real-time breakdown of accommodation, inter-city transport, & daily expenses</p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.8rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Estimated Total</span>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#38BDF8' }}>
              {currencySymbol}{grandTotal.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Budget Progress Bar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.4rem', color: '#94A3B8', fontWeight: 600 }}>
            <span>Target Budget: {currencySymbol}{budgetCap.toLocaleString()}</span>
            <span>{percentage}% Used</span>
          </div>
          <div style={{ width: '100%', height: 10, borderRadius: 5, background: 'rgba(255,255,255,0.15)', overflow: 'hidden' }}>
            <div 
              style={{ 
                width: `${percentage}%`, 
                height: '100%', 
                background: percentage > 90 ? '#F43F5E' : 'linear-gradient(90deg, #38BDF8 0%, #818CF8 100%)', 
                borderRadius: 5,
                transition: 'width 0.5s ease'
              }}
            />
          </div>
        </div>
      </div>

      {/* Category Cost Breakdown Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
        <div className="glass-card stat-card">
          <div className="stat-icon">
            <Hotel size={24} />
          </div>
          <div>
            <div className="stat-val">{currencySymbol}{totalHotelCost.toLocaleString()}</div>
            <div className="stat-lbl">Accommodation ({totalStayDays} Nights)</div>
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-icon" style={{ color: 'var(--accent-indigo)' }}>
            <Plane size={24} />
          </div>
          <div>
            <div className="stat-val">{currencySymbol}{totalTransportCost.toLocaleString()}</div>
            <div className="stat-lbl">Inter-City Transport</div>
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-icon" style={{ color: 'var(--accent-amber)' }}>
            <Coffee size={24} />
          </div>
          <div>
            <div className="stat-val">{currencySymbol}{estimatedFoodCost.toLocaleString()}</div>
            <div className="stat-lbl">Food & Daily Activities</div>
          </div>
        </div>
      </div>

      {/* Per City Expense Breakdown Table */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <PieChart size={18} className="gradient-text" /> Per-City Expenditure Table
        </h4>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', textAlign: 'left' }}>
                <th style={{ padding: '0.75rem 0.5rem' }}>Destination</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Duration</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Hotel Rate</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Stay Subtotal</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>Transport Onward</th>
              </tr>
            </thead>
            <tbody>
              {cities.map((city, idx) => (
                <tr key={city.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '0.85rem 0.5rem', fontWeight: 600 }}>
                    {idx + 1}. {city.name}, <span style={{ color: 'var(--text-secondary)' }}>{city.country}</span>
                  </td>
                  <td style={{ padding: '0.85rem 0.5rem' }}>{city.days} Nights</td>
                  <td style={{ padding: '0.85rem 0.5rem' }}>{currencySymbol}{city.costPerNight}/night</td>
                  <td style={{ padding: '0.85rem 0.5rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>
                    {currencySymbol}{city.days * city.costPerNight}
                  </td>
                  <td style={{ padding: '0.85rem 0.5rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>
                    {city.transportToNext ? `+${currencySymbol}${city.transportToNext.cost} (${city.transportToNext.type})` : '— Final Stop'}
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
