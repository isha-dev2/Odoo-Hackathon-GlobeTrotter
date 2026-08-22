import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, MapPin,
  Clock, Sun, CloudSun, Sparkles, Navigation, Train, Plane, Car,
  CheckCircle, List, ArrowRight
} from 'lucide-react';

const COLORS = ['#0d9488', '#7c3aed', '#f59e0b', '#2563eb', '#db2777', '#059669'];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDay(year, month) {
  return new Date(year, month, 1).getDay();
}

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

export default function TimelineCalendar({
  currentTrip,
  currencySymbol = '$'
}) {
  const [viewMode, setViewMode] = useState('timeline'); // 'timeline' | 'calendar'

  // Initialize month/year from currentTrip's start date
  const tripStartDate = currentTrip?.startDate ? new Date(currentTrip.startDate) : new Date();
  const [viewMonth, setViewMonth] = useState(isNaN(tripStartDate) ? new Date().getMonth() : tripStartDate.getMonth());
  const [viewYear, setViewYear] = useState(isNaN(tripStartDate) ? new Date().getFullYear() : tripStartDate.getFullYear());

  useEffect(() => {
    if (currentTrip?.startDate) {
      const d = new Date(currentTrip.startDate);
      if (!isNaN(d)) {
        setViewMonth(d.getMonth());
        setViewYear(d.getFullYear());
      }
    }
  }, [currentTrip?.startDate]);

  if (!currentTrip) {
    return (
      <div style={{
        background: '#ffffff', borderRadius: '24px', padding: '60px 24px',
        textAlign: 'center', border: '2px dashed #cbd5e1'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📅</div>
        <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a' }}>No Trip Selected</h2>
        <p style={{ fontSize: '14px', color: '#64748b', marginTop: '6px' }}>
          Please select or create a trip to explore the itinerary schedule and timeline.
        </p>
      </div>
    );
  }

  const stops = currentTrip.stops || [];
  const start = new Date(currentTrip.startDate);
  const end = new Date(currentTrip.endDate);
  const daysCount = isNaN(start) || isNaN(end) ? 7 : Math.max(1, Math.round((end - start) / 86400000));

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const daysInCurMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDayOfWeek = getFirstDay(viewYear, viewMonth);

  // Accurate calendar day mapping
  const dayStopMap = {};
  stops.forEach((stop, idx) => {
    const sDate = new Date(stop.startDate || currentTrip.startDate);
    const eDate = new Date(stop.endDate || currentTrip.endDate);
    if (!isNaN(sDate) && !isNaN(eDate)) {
      for (let cur = new Date(sDate); cur <= eDate; cur.setDate(cur.getDate() + 1)) {
        if (cur.getMonth() === viewMonth && cur.getFullYear() === viewYear) {
          dayStopMap[cur.getDate()] = {
            stop,
            color: COLORS[idx % COLORS.length],
            cityName: stop.city?.name || stop.city || 'City'
          };
        }
      }
    }
  });

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
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.35)', borderRadius: '99px', padding: '4px 12px', marginBottom: '10px' }}>
              <CalendarIcon size={12} color="#34d399" />
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#6ee7b7', letterSpacing: '0.05em' }}>
                SCHEDULE VISUALIZER & CALENDAR
              </span>
            </div>

            <h1 style={{ fontSize: '32px', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.5px', margin: 0 }}>
              {currentTrip.name} — Journey Timeline
            </h1>

            <p style={{ fontSize: '14px', color: '#cbd5e1', marginTop: '8px' }}>
              {daysCount} Days Schedule · {stops.length} Cities · {currentTrip.startDate} to {currentTrip.endDate}
            </p>
          </div>

          {/* View Mode Toggle */}
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.15)', borderRadius: '14px', padding: '4px', border: '1px solid rgba(255,255,255,0.2)' }}>
            <button
              onClick={() => setViewMode('timeline')}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 16px', borderRadius: '10px',
                background: viewMode === 'timeline' ? '#ffffff' : 'transparent',
                color: viewMode === 'timeline' ? '#0f172a' : '#ffffff',
                border: 'none', fontSize: '12px', fontWeight: 800, cursor: 'pointer',
                boxShadow: viewMode === 'timeline' ? '0 2px 8px rgba(0,0,0,0.15)' : 'none'
              }}
            >
              <List size={14} />
              <span>Vertical Timeline</span>
            </button>

            <button
              onClick={() => setViewMode('calendar')}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 16px', borderRadius: '10px',
                background: viewMode === 'calendar' ? '#ffffff' : 'transparent',
                color: viewMode === 'calendar' ? '#0f172a' : '#ffffff',
                border: 'none', fontSize: '12px', fontWeight: 800, cursor: 'pointer',
                boxShadow: viewMode === 'calendar' ? '0 2px 8px rgba(0,0,0,0.15)' : 'none'
              }}
            >
              <CalendarIcon size={14} />
              <span>Month Calendar</span>
            </button>
          </div>
        </div>
      </div>

      {/* VIEW 1: Vertical Flow Timeline */}
      {viewMode === 'timeline' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {stops.length === 0 ? (
            <div style={{ background: '#ffffff', borderRadius: '20px', padding: '50px', textAlign: 'center', border: '2px dashed #cbd5e1' }}>
              <MapPin size={40} color="#94a3b8" style={{ margin: '0 auto 10px' }} />
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#334155' }}>No stops in itinerary yet</div>
              <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>Add cities in the Trip Builder to generate your schedule.</div>
            </div>
          ) : (
            stops.map((stop, idx) => {
              const color = COLORS[idx % COLORS.length];
              const cityName = stop.city?.name || stop.city || 'City';
              const activities = stop.activities || [];

              return (
                <div key={stop.id || idx} style={{ position: 'relative' }}>
                  
                  {/* City Stop Card */}
                  <div style={{
                    background: '#ffffff', borderRadius: '24px',
                    border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                    padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '16px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{
                          width: '44px', height: '44px', borderRadius: '14px',
                          background: color, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#ffffff', fontWeight: 900, fontSize: '16px',
                          boxShadow: `0 4px 12px ${color}40`
                        }}>
                          {idx + 1}
                        </div>

                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                              📍 {cityName}
                            </h3>
                            <span style={{ fontSize: '11px', fontWeight: 800, color: color, background: `${color}15`, padding: '3px 8px', borderRadius: '6px' }}>
                              Stop #{idx + 1}
                            </span>
                          </div>
                          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px', fontWeight: 600 }}>
                            {stop.startDate || 'Day 1'} to {stop.endDate || 'Day 3'}
                          </div>
                        </div>
                      </div>

                      {/* Simulated Weather Pill */}
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        background: '#fffbeb', border: '1px solid #fde68a',
                        borderRadius: '10px', padding: '6px 12px', fontSize: '12px', fontWeight: 700, color: '#b45309'
                      }}>
                        <Sun size={14} color="#f59e0b" />
                        <span>24°C Sunny & Clear</span>
                      </div>
                    </div>

                    {/* Activities scheduled for this stop */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {activities.length === 0 ? (
                        <div style={{ padding: '14px', background: '#f8fafc', borderRadius: '12px', fontSize: '13px', color: '#64748b', textAlign: 'center' }}>
                          No activities assigned for this city yet.
                        </div>
                      ) : (
                        activities.map((act, aIdx) => (
                          <div
                            key={act.id || aIdx}
                            style={{
                              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                              background: '#f8fafc', borderRadius: '14px', padding: '12px 18px',
                              border: '1px solid #e2e8f0', gap: '12px'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <span style={{ fontSize: '18px' }}>🎯</span>
                              <div>
                                <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>{act.name}</div>
                                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                                  {act.time || '10:00 AM'} · Duration: {act.duration || '2 hours'} · Category: {act.category || 'Sightseeing'}
                                </div>
                              </div>
                            </div>

                            <span style={{ fontSize: '13px', fontWeight: 800, color: '#0d9488', background: '#ecfdf5', padding: '3px 10px', borderRadius: '8px' }}>
                              {currencySymbol}{act.cost || 0}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Transit Flow Arrow between stops */}
                  {idx < stops.length - 1 && (
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      padding: '12px 0', gap: '8px', color: '#0d9488', fontWeight: 800, fontSize: '13px'
                    }}>
                      <div style={{ height: '24px', width: '2px', background: '#a7f3d0' }} />
                      <Train size={16} />
                      <span>Transit connection to {stops[idx + 1].city?.name || stops[idx + 1].city || 'Next Stop'} (~2h 30m)</span>
                      <div style={{ height: '24px', width: '2px', background: '#a7f3d0' }} />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* VIEW 2: Monthly Calendar Grid */}
      {viewMode === 'calendar' && (
        <div style={{ background: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
          {/* Month Controller */}
          <div style={{ padding: '20px 28px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button onClick={prevMonth} style={{ width: '36px', height: '36px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ChevronLeft size={18} color="#334155" />
            </button>
            <div style={{ fontSize: '18px', fontWeight: 900, color: '#0f172a' }}>
              {MONTH_NAMES[viewMonth]} {viewYear}
            </div>
            <button onClick={nextMonth} style={{ width: '36px', height: '36px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ChevronRight size={18} color="#334155" />
            </button>
          </div>

          {/* Weekday headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(d => (
              <div key={d} style={{ padding: '12px 6px', textAlign: 'center', fontSize: '11px', fontWeight: 800, color: '#64748b' }}>
                {d}
              </div>
            ))}
          </div>

          {/* Calendar Grid Cells */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
            {Array(firstDayOfWeek).fill(null).map((_, i) => (
              <div key={`empty-${i}`} style={{ minHeight: '90px', borderRight: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9' }} />
            ))}

            {Array(daysInCurMonth).fill(null).map((_, i) => {
              const day = i + 1;
              const mappedEvent = dayStopMap[day];

              return (
                <div
                  key={day}
                  style={{
                    minHeight: '90px', padding: '10px',
                    borderRight: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9',
                    background: mappedEvent ? `${mappedEvent.color}10` : '#ffffff'
                  }}
                >
                  <div style={{ fontSize: '12px', fontWeight: 800, color: mappedEvent ? mappedEvent.color : '#334155', marginBottom: '6px' }}>
                    {day}
                  </div>

                  {mappedEvent && (
                    <div style={{
                      fontSize: '10px', fontWeight: 800, color: '#ffffff',
                      background: mappedEvent.color,
                      borderRadius: '6px', padding: '3px 6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                    }}>
                      📍 {mappedEvent.cityName}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
