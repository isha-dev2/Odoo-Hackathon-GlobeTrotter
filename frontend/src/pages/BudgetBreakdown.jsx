import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, PieChart, Target, AlertCircle, CheckCircle } from 'lucide-react';

const CAT_COLORS = {
  Food: { bg: '#fef3c7', bar: '#f59e0b', emoji: '🍽️' },
  Sightseeing: { bg: '#eff6ff', bar: '#3b82f6', emoji: '🎯' },
  Adventure: { bg: '#dcfce7', bar: '#22c55e', emoji: '⛺' },
  Culture: { bg: '#fce7f3', bar: '#ec4899', emoji: '🏛️' },
  Shopping: { bg: '#faf5ff', bar: '#a855f7', emoji: '🛍️' },
  Relaxation: { bg: '#cffafe', bar: '#06b6d4', emoji: '🧘' },
  Nightlife: { bg: '#fdf4ff', bar: '#d946ef', emoji: '🎉' },
  Transport: { bg: '#f1f5f9', bar: '#64748b', emoji: '🚌' },
  Other: { bg: '#f8fafc', bar: '#94a3b8', emoji: '📋' },
};

export default function BudgetBreakdown({ currentTrip }) {
  if (!currentTrip) {
    return (
      <div style={{ background: 'white', borderRadius: 20, padding: '60px', textAlign: 'center', border: '1.5px dashed #e2e8f0' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>💰</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#374151' }}>No trip selected</div>
        <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 6 }}>Select a trip to see budget breakdown</div>
      </div>
    );
  }

  const stops = currentTrip.stops || [];
  const allActivities = stops.flatMap(s => s.activities || []);
  const totalSpent = allActivities.reduce((sum, a) => sum + (a.cost || 0), 0);
  const budget = currentTrip.budgetLimit || 0;
  const remaining = budget - totalSpent;
  const percent = budget > 0 ? Math.min(100, Math.round((totalSpent / budget) * 100)) : 0;

  // Category breakdown
  const catBreakdown = {};
  allActivities.forEach(a => {
    const cat = a.category || 'Other';
    catBreakdown[cat] = (catBreakdown[cat] || 0) + (a.cost || 0);
  });
  const catEntries = Object.entries(catBreakdown).sort((a, b) => b[1] - a[1]);

  // Per-city breakdown
  const cityBreakdown = stops.map(s => ({
    city: s.city?.name || s.city || 'City',
    total: (s.activities || []).reduce((sum, a) => sum + (a.cost || 0), 0),
    count: s.activities?.length || 0
  })).filter(c => c.count > 0);

  const isOverBudget = budget > 0 && totalSpent > budget;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a, #134e4a)',
        borderRadius: 20, padding: '24px 28px'
      }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: 'white', margin: 0, letterSpacing: '-0.5px' }}>
          Budget Breakdown
        </h1>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', margin: '5px 0 0' }}>
          {currentTrip.name} · {allActivities.length} activities tracked
        </p>
      </div>

      {/* Budget Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        {[
          { label: 'Total Budget', value: `$${budget.toLocaleString()}`, icon: Target, bg: '#f0fdf9', iconBg: '#0d9488', sub: 'Trip budget limit' },
          { label: 'Total Spent', value: `$${totalSpent.toLocaleString()}`, icon: DollarSign, bg: '#eff6ff', iconBg: '#3b82f6', sub: `${allActivities.length} activities` },
          {
            label: remaining >= 0 ? 'Remaining' : 'Over Budget',
            value: `$${Math.abs(remaining).toLocaleString()}`,
            icon: remaining >= 0 ? CheckCircle : AlertCircle,
            bg: remaining >= 0 ? '#f0fdf9' : '#fff5f5',
            iconBg: remaining >= 0 ? '#0d9488' : '#e53e3e',
            sub: remaining >= 0 ? 'You are on track!' : 'Exceeds budget'
          },
        ].map(({ label, value, icon: Icon, bg, iconBg, sub }) => (
          <div key={label} style={{ background: bg, borderRadius: 16, padding: '18px 20px', border: '1px solid rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.05em' }}>{label}</div>
                <div style={{ fontSize: 24, fontWeight: 900, color: '#0f172a', letterSpacing: '-1px', marginTop: 4 }}>{value}</div>
                <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 4 }}>{sub}</div>
              </div>
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0
              }}>
                <Icon size={18} color="white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Budget Progress Bar */}
      {budget > 0 && (
        <div style={{ background: 'white', borderRadius: 16, padding: '20px 22px', border: '1.5px solid #e8f0ef' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: '#0f172a' }}>Budget Used</span>
            <span style={{
              fontSize: 13, fontWeight: 900,
              color: isOverBudget ? '#e53e3e' : percent > 75 ? '#f59e0b' : '#0d9488'
            }}>
              {percent}%
            </span>
          </div>
          <div style={{ height: 10, background: '#f1f5f9', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${percent}%`,
              background: isOverBudget
                ? 'linear-gradient(90deg, #e53e3e, #fc8181)'
                : percent > 75
                ? 'linear-gradient(90deg, #f59e0b, #fcd34d)'
                : 'linear-gradient(90deg, #0d9488, #10b981)',
              borderRadius: 99, transition: 'width 0.5s ease'
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
            <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600 }}>$0</span>
            <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600 }}>${budget.toLocaleString()}</span>
          </div>
        </div>
      )}

      {/* Two Column: Category + City Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Category Breakdown */}
        <div style={{ background: 'white', borderRadius: 16, padding: '20px', border: '1.5px solid #e8f0ef' }}>
          <h3 style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', margin: '0 0 16px' }}>By Category</h3>
          {catEntries.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px 0', color: '#94a3b8', fontSize: 12 }}>
              No activities recorded
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {catEntries.map(([cat, amount]) => {
                const colors = CAT_COLORS[cat] || CAT_COLORS.Other;
                const catPercent = totalSpent > 0 ? Math.round((amount / totalSpent) * 100) : 0;
                return (
                  <div key={cat}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 14 }}>{colors.emoji}</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#374151' }}>{cat}</span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: 12, fontWeight: 800, color: '#0f172a' }}>${amount.toLocaleString()}</span>
                        <span style={{ fontSize: 10, color: '#94a3b8', marginLeft: 4 }}>({catPercent}%)</span>
                      </div>
                    </div>
                    <div style={{ height: 6, background: '#f1f5f9', borderRadius: 99, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', width: `${catPercent}%`,
                        background: colors.bar, borderRadius: 99
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* City Breakdown */}
        <div style={{ background: 'white', borderRadius: 16, padding: '20px', border: '1.5px solid #e8f0ef' }}>
          <h3 style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', margin: '0 0 16px' }}>By City</h3>
          {cityBreakdown.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px 0', color: '#94a3b8', fontSize: 12 }}>
              No activities recorded
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {cityBreakdown.map(({ city, total, count }) => {
                const cityPct = totalSpent > 0 ? Math.round((total / totalSpent) * 100) : 0;
                return (
                  <div key={city}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 12 }}>📍</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#374151' }}>{city}</span>
                        <span style={{ fontSize: 10, color: '#94a3b8' }}>({count} act.)</span>
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 800, color: '#0f172a' }}>${total.toLocaleString()}</span>
                    </div>
                    <div style={{ height: 6, background: '#f1f5f9', borderRadius: 99, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', width: `${cityPct}%`,
                        background: 'linear-gradient(90deg, #0d9488, #10b981)', borderRadius: 99
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Per-Activity Table */}
      {allActivities.filter(a => a.cost > 0).length > 0 && (
        <div style={{ background: 'white', borderRadius: 16, border: '1.5px solid #e8f0ef', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', margin: 0 }}>Activity Cost Log</h3>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  {['Activity', 'Category', 'City', 'Cost'].map(h => (
                    <th key={h} style={{
                      padding: '10px 16px', textAlign: 'left',
                      fontSize: 10, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.05em'
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stops.flatMap(s =>
                  (s.activities || [])
                    .filter(a => a.cost > 0)
                    .map((a, i) => {
                      const colors = CAT_COLORS[a.category] || CAT_COLORS.Other;
                      return (
                        <tr key={`${s.id}-${i}`} style={{ borderTop: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '10px 16px', fontSize: 12, fontWeight: 600, color: '#0f172a' }}>{a.name}</td>
                          <td style={{ padding: '10px 16px' }}>
                            <span style={{
                              fontSize: 9, fontWeight: 700, color: colors.bar,
                              background: colors.bg, borderRadius: 99, padding: '2px 8px'
                            }}>
                              {colors.emoji} {a.category}
                            </span>
                          </td>
                          <td style={{ padding: '10px 16px', fontSize: 11, color: '#64748b', fontWeight: 600 }}>
                            {s.city?.name || s.city || 'City'}
                          </td>
                          <td style={{ padding: '10px 16px', fontSize: 12, fontWeight: 800, color: '#0d9488' }}>
                            ${a.cost.toLocaleString()}
                          </td>
                        </tr>
                      );
                    })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
