import React, { useState } from 'react';
import {
  DollarSign, TrendingUp, TrendingDown, PieChart, Target,
  AlertCircle, CheckCircle, Plus, Wallet, ShieldAlert,
  ArrowRight, Sparkles, Building, Utensils, Plane, Ticket, HelpCircle
} from 'lucide-react';

const EXPENSE_CATEGORIES = [
  { name: 'Activities & Tours', icon: Ticket, color: '#0d9488', bg: '#f0fdf9', border: '#a7f3d0' },
  { name: 'Accommodation / Stays', icon: Building, color: '#7c3aed', bg: '#faf5ff', border: '#e9d5ff' },
  { name: 'Transport & Flights', icon: Plane, color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' },
  { name: 'Dining & Meals', icon: Utensils, color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
  { name: 'Miscellaneous', icon: HelpCircle, color: '#64748b', bg: '#f8fafc', border: '#cbd5e1' },
];

export default function BudgetBreakdown({
  currentTrip,
  currencySymbol = '$',
  onUpdateTrip
}) {
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [newExpense, setNewExpense] = useState({
    title: '', category: 'Accommodation / Stays', amount: '', city: ''
  });

  if (!currentTrip) {
    return (
      <div style={{
        background: '#ffffff', borderRadius: '24px', padding: '60px 24px',
        textAlign: 'center', border: '2px dashed #cbd5e1'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>💰</div>
        <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a' }}>No Trip Selected</h2>
        <p style={{ fontSize: '14px', color: '#64748b', marginTop: '6px' }}>
          Please choose a trip to inspect financial projections and cost allocations.
        </p>
      </div>
    );
  }

  const stops = currentTrip.stops || [];
  const allActivities = stops.flatMap(s => s.activities || []);
  const activitySpent = allActivities.reduce((sum, a) => sum + (a.cost || 0), 0);

  // Additional mock estimates for realistic budget allocation
  const staySpent = Math.round((currentTrip.budgetLimit || 2000) * 0.40);
  const transportSpent = Math.round((currentTrip.budgetLimit || 2000) * 0.25);
  const diningSpent = Math.round((currentTrip.budgetLimit || 2000) * 0.15);

  const totalSpent = activitySpent + staySpent + transportSpent + diningSpent;
  const budget = currentTrip.budgetLimit || 2500;
  const remaining = budget - totalSpent;
  const percentUsed = Math.min(100, Math.round((totalSpent / budget) * 100));
  const isOverBudget = totalSpent > budget;

  // Day count calculation
  const start = new Date(currentTrip.startDate);
  const end = new Date(currentTrip.endDate);
  const daysCount = isNaN(start) || isNaN(end) ? 7 : Math.max(1, Math.round((end - start) / 86400000));
  const dailyAverage = Math.round(totalSpent / daysCount);

  const categoryAllocations = [
    { name: 'Accommodation / Stays', amount: staySpent, percent: Math.round((staySpent / totalSpent) * 100), color: '#7c3aed', icon: Building },
    { name: 'Transport & Flights', amount: transportSpent, percent: Math.round((transportSpent / totalSpent) * 100), color: '#2563eb', icon: Plane },
    { name: 'Activities & Tours', amount: activitySpent, percent: Math.round((activitySpent / totalSpent) * 100), color: '#0d9488', icon: Ticket },
    { name: 'Dining & Meals', amount: diningSpent, percent: Math.round((diningSpent / totalSpent) * 100), color: '#d97706', icon: Utensils },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* 1. Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #042f2e 0%, #064e3b 40%, #0f172a 100%)',
        borderRadius: '24px', padding: '36px 40px',
        position: 'relative', overflow: 'hidden',
        boxShadow: '0 12px 36px -8px rgba(4, 47, 46, 0.4)',
        border: '1px solid rgba(16, 185, 129, 0.2)'
      }}>
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.35)', borderRadius: '99px', padding: '4px 12px', marginBottom: '10px' }}>
              <Wallet size={12} color="#34d399" />
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#6ee7b7', letterSpacing: '0.05em' }}>
                TRIP FINANCIAL INTELLIGENCE & BUDGET BREAKDOWN
              </span>
            </div>

            <h1 style={{ fontSize: '32px', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.5px', margin: 0 }}>
              {currentTrip.name} — Cost Analyzer
            </h1>

            <p style={{ fontSize: '14px', color: '#cbd5e1', marginTop: '8px' }}>
              Automatic cost estimation for accommodation, transport, sightseeing tours, and daily food budget.
            </p>
          </div>

          <button
            onClick={() => setShowAddExpense(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: 'linear-gradient(135deg, #0d9488 0%, #10b981 100%)',
              color: '#ffffff', border: 'none', borderRadius: '12px',
              padding: '12px 20px', fontSize: '13px', fontWeight: 800, cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(13,148,136,0.35)'
            }}
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>Add Custom Expense</span>
          </button>
        </div>
      </div>

      {/* Over-Budget Alert Banner if spending exceeds budget limit */}
      {isOverBudget && (
        <div style={{
          background: '#fff1f2', border: '1.5px solid #fecdd3',
          borderRadius: '18px', padding: '16px 22px',
          display: 'flex', alignItems: 'center', gap: '14px',
          boxShadow: '0 4px 14px rgba(225, 29, 72, 0.08)'
        }}>
          <ShieldAlert size={24} color="#e11d48" style={{ flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: '14px', fontWeight: 900, color: '#9f1239' }}>
              Attention: Projected spending exceeds your target budget!
            </div>
            <div style={{ fontSize: '12px', color: '#be123c', marginTop: '2px' }}>
              Total estimated cost is {currencySymbol}{totalSpent.toLocaleString()}, which is {currencySymbol}{Math.abs(remaining).toLocaleString()} over your {currencySymbol}{budget.toLocaleString()} ceiling. Consider adjusting accommodation or activities.
            </div>
          </div>
        </div>
      )}

      {/* 2. Key Budget Overview Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        {[
          { label: 'Target Budget Limit', value: `${currencySymbol}${budget.toLocaleString()}`, sub: 'Set during trip creation', icon: Target, bg: '#f0fdf9', border: '#a7f3d0', iconBg: '#0d9488' },
          { label: 'Total Projected Cost', value: `${currencySymbol}${totalSpent.toLocaleString()}`, sub: `${daysCount} days total estimate`, icon: DollarSign, bg: '#eff6ff', border: '#bfdbfe', iconBg: '#2563eb' },
          { label: remaining >= 0 ? 'Remaining Balance' : 'Budget Overdraft', value: `${currencySymbol}${Math.abs(remaining).toLocaleString()}`, sub: remaining >= 0 ? 'Safe within budget' : 'Over planned limit', icon: remaining >= 0 ? CheckCircle : AlertCircle, bg: remaining >= 0 ? '#f0fdf4' : '#fff1f2', border: remaining >= 0 ? '#bbf7d0' : '#fecdd3', iconBg: remaining >= 0 ? '#16a34a' : '#e11d48' },
          { label: 'Average Cost / Day', value: `${currencySymbol}${dailyAverage}/day`, sub: `Across ${stops.length} destinations`, icon: TrendingUp, bg: '#fffbeb', border: '#fde68a', iconBg: '#d97706' },
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

      {/* 3. Budget Utilization Progress Bar */}
      <div style={{
        background: '#ffffff', borderRadius: '20px', padding: '24px 28px',
        border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{ fontSize: '15px', fontWeight: 900, color: '#0f172a' }}>
            Budget Allocation Meter ({percentUsed}% Allocated)
          </span>
          <span style={{ fontSize: '13px', fontWeight: 800, color: isOverBudget ? '#e11d48' : '#0d9488' }}>
            {currencySymbol}{totalSpent.toLocaleString()} of {currencySymbol}{budget.toLocaleString()}
          </span>
        </div>

        {/* Multi-segment stacked progress bar */}
        <div style={{ height: '14px', background: '#f1f5f9', borderRadius: '99px', overflow: 'hidden', display: 'flex' }}>
          {categoryAllocations.map(cat => (
            <div
              key={cat.name}
              style={{
                height: '100%',
                width: `${cat.percent}%`,
                background: cat.color,
                transition: 'width 0.4s ease'
              }}
              title={`${cat.name}: ${cat.percent}%`}
            />
          ))}
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: '16px', marginTop: '16px', flexWrap: 'wrap' }}>
          {categoryAllocations.map(cat => (
            <div key={cat.name} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: '#334155' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: cat.color, display: 'inline-block' }} />
              <span>{cat.name} ({cat.percent}%)</span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Category Breakdown Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
        {categoryAllocations.map(cat => {
          const Icon = cat.icon;
          return (
            <div
              key={cat.name}
              style={{
                background: '#ffffff', borderRadius: '20px', padding: '22px',
                border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                <div style={{
                  width: '42px', height: '42px', borderRadius: '12px',
                  background: `${cat.color}15`, border: `1px solid ${cat.color}35`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Icon size={20} color={cat.color} />
                </div>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>{cat.name}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>{cat.percent}% of overall journey cost</div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid #f1f5f9', paddingTop: '14px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Projected Cost</div>
                  <div style={{ fontSize: '22px', fontWeight: 900, color: '#0f172a' }}>
                    {currencySymbol}{cat.amount.toLocaleString()}
                  </div>
                </div>

                <span style={{
                  fontSize: '11px', fontWeight: 800, color: cat.color,
                  background: `${cat.color}15`, padding: '4px 10px', borderRadius: '8px'
                }}>
                  Tracked Live
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
