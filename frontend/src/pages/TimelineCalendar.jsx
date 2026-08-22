import React from 'react';
import { Calendar, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { useState } from 'react';

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDay(year, month) {
  return new Date(year, month, 1).getDay();
}

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

const COLORS = ['#0d9488', '#7c3aed', '#f59e0b', '#3b82f6', '#ec4899', '#22c55e'];

export default function TimelineCalendar({ currentTrip }) {
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());

  if (!currentTrip) {
    return (
      <div style={{ background: 'white', borderRadius: 20, padding: '60px', textAlign: 'center', border: '1.5px dashed #e2e8f0' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>📅</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#374151' }}>No trip selected</div>
      </div>
    );
  }

  const stops = currentTrip.stops || [];
  const daysCount = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDay(viewYear, viewMonth);

  // Build day map: day number => [{ city, actName }]
  const dayMap = {};
  stops.forEach((stop, stopIdx) => {
    const color = COLORS[stopIdx % COLORS.length];
    const startD = new Date(stop.startDate || currentTrip.startDate);
    const endD = new Date(stop.endDate || currentTrip.endDate);
    if (!isNaN(startD) && !isNaN(endD)) {
      for (let d = new Date(startD); d <= endD; d.setDate(d.getDate() + 1)) {
        if (d.getMonth() === viewMonth && d.getFullYear() === viewYear) {
          const key = d.getDate();
          if (!dayMap[key]) dayMap[key] = [];
          dayMap[key].push({ city: stop.city?.name || stop.city || 'City', color });
        }
      }
    }
    // Mark activities
    (stop.activities || []).forEach(act => {
      if (act.date) {
        const actD = new Date(act.date);
        if (actD.getMonth() === viewMonth && actD.getFullYear() === viewYear) {
          const key = actD.getDate();
          if (!dayMap[key]) dayMap[key] = [];
          dayMap[key].push({ city: act.name, color, isActivity: true });
        }
      }
    });
  });

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const tripStart = new Date(currentTrip.startDate);
  const tripEnd = new Date(currentTrip.endDate);
  const tripDays = isNaN(tripStart) || isNaN(tripEnd) ? 0 : Math.max(0, Math.round((tripEnd - tripStart) / 86400000));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a, #134e4a)',
        borderRadius: 20, padding: '24px 28px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12
      }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: 'white', margin: 0, letterSpacing: '-0.5px' }}>
            Trip Timeline
          </h1>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', margin: '5px 0 0' }}>
            {currentTrip.name} · {tripDays} days
          </p>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {stops.slice(0, 4).map((stop, i) => (
            <div key={stop.id || i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: COLORS[i % COLORS.length] }} />
              <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>
                {stop.city?.name || stop.city || 'City'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Calendar */}
      <div style={{ background: 'white', borderRadius: 20, border: '1.5px solid #e8f0ef', overflow: 'hidden' }}>
        {/* Month Navigation */}
        <div style={{
          padding: '18px 24px', borderBottom: '1px solid #f1f5f9',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <button onClick={prevMonth} style={{
            width: 34, height: 34, borderRadius: 10, border: '1.5px solid #e2e8f0',
            background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <ChevronLeft size={16} color="#64748b" />
          </button>
          <div style={{ fontSize: 17, fontWeight: 900, color: '#0f172a' }}>
            {MONTH_NAMES[viewMonth]} {viewYear}
          </div>
          <button onClick={nextMonth} style={{
            width: 34, height: 34, borderRadius: 10, border: '1.5px solid #e2e8f0',
            background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <ChevronRight size={16} color="#64748b" />
          </button>
        </div>

        {/* Day of Week Headers */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid #f1f5f9' }}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} style={{
              padding: '10px 4px', textAlign: 'center',
              fontSize: 10, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.05em'
            }}>
              {d}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
          {/* Empty cells before first day */}
          {Array(firstDay).fill(null).map((_, i) => (
            <div key={`empty-${i}`} style={{ minHeight: 80, borderRight: '1px solid #f8fafc', borderBottom: '1px solid #f8fafc' }} />
          ))}

          {/* Day cells */}
          {Array(daysCount).fill(null).map((_, i) => {
            const day = i + 1;
            const events = dayMap[day] || [];
            const isToday = day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();

            return (
              <div key={day} style={{
                minHeight: 80, padding: '8px 6px',
                borderRight: '1px solid #f8fafc', borderBottom: '1px solid #f8fafc',
                background: isToday ? '#f0fdf9' : 'white'
              }}>
                <div style={{
                  width: 24, height: 24, borderRadius: '50%',
                  background: isToday ? 'linear-gradient(135deg, #0d9488, #10b981)' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 4
                }}>
                  <span style={{
                    fontSize: 11, fontWeight: isToday ? 900 : 600,
                    color: isToday ? 'white' : events.length > 0 ? '#0f172a' : '#cbd5e1'
                  }}>
                    {day}
                  </span>
                </div>
                {events.slice(0, 2).map((ev, ei) => (
                  <div key={ei} style={{
                    fontSize: 9, fontWeight: 700,
                    background: ev.color + '20',
                    color: ev.color,
                    borderLeft: `3px solid ${ev.color}`,
                    borderRadius: '0 4px 4px 0',
                    padding: '1px 4px', marginBottom: 2,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                  }}>
                    {ev.city}
                  </div>
                ))}
                {events.length > 2 && (
                  <div style={{ fontSize: 9, color: '#94a3b8', fontWeight: 600 }}>+{events.length - 2} more</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Stop Timeline Cards */}
      {stops.length > 0 && (
        <div style={{ background: 'white', borderRadius: 20, padding: '20px 24px', border: '1.5px solid #e8f0ef' }}>
          <h3 style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', margin: '0 0 16px' }}>City Timeline</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {stops.map((stop, i) => {
              const color = COLORS[i % COLORS.length];
              const cityName = stop.city?.name || stop.city || 'City';
              return (
                <div key={stop.id || i} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '12px 16px', background: '#f8fafc', borderRadius: 12,
                  borderLeft: `4px solid ${color}`
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                    background: color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 16
                  }}>
                    <MapPin size={16} color={color} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a' }}>{cityName}</div>
                    <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>
                      {stop.startDate && stop.endDate
                        ? `${new Date(stop.startDate).toLocaleDateString()} → ${new Date(stop.endDate).toLocaleDateString()}`
                        : 'Dates not set'}
                    </div>
                  </div>
                  <div style={{
                    fontSize: 11, fontWeight: 700, color, background: color + '15',
                    borderRadius: 99, padding: '4px 10px'
                  }}>
                    {stop.activities?.length || 0} activities
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
