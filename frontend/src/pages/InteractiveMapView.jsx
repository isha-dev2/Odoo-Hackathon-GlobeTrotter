import React, { useState } from 'react';
import { MapPin, Navigation, Compass, Plane, Train, Sun, CloudRain, Wind, Sparkles, Download, Info, CheckCircle2 } from 'lucide-react';
import { MOCK_CITIES } from '../api/client';

export default function InteractiveMapView({ currentTrip, onSelectCity }) {
  const [selectedPin, setSelectedPin] = useState(null);

  const stops = (currentTrip && currentTrip.stops && currentTrip.stops.length > 0)
    ? currentTrip.stops
    : [
        { id: 's1', city: MOCK_CITIES[0], startDate: '2026-09-01', endDate: '2026-09-05', weather: '22°C Clear', duration: '4 Days' },
        { id: 's2', city: MOCK_CITIES[3], startDate: '2026-09-05', endDate: '2026-09-09', weather: '26°C Sunny', duration: '4 Days' },
        { id: 's3', city: MOCK_CITIES[4], startDate: '2026-09-09', endDate: '2026-09-12', weather: '24°C Breezy', duration: '3 Days' },
        { id: 's4', city: MOCK_CITIES[6], startDate: '2026-09-12', endDate: '2026-09-15', weather: '19°C Mild', duration: '3 Days' },
      ];

  const cityCoordinates = [
    { x: 18, y: 35, city: stops[0]?.city || MOCK_CITIES[0], distance: 'Direct Flight' },
    { x: 38, y: 62, city: stops[1]?.city || MOCK_CITIES[3], distance: '1,105 km • 2h 05m' },
    { x: 62, y: 48, city: stops[2]?.city || MOCK_CITIES[4], distance: '850 km • 1h 45m' },
    { x: 82, y: 30, city: stops[3]?.city || MOCK_CITIES[6], distance: '1,240 km • 2h 20m' },
  ];

  const activePin = selectedPin || cityCoordinates[0];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Map Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-700 dark:text-teal-300 text-xs font-bold uppercase tracking-wider">
            FLIGHT TOPOLOGY & MAP CANVAS
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1.5 flex items-center gap-2">
            <Compass className="w-7 h-7 text-teal-600 dark:text-teal-400" />
            Interactive Route Map
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Visualize flight topologies, geographical connections, and inter-city travel distances
          </p>
        </div>

        <button
          onClick={() => alert('Map route exported successfully as PNG topology vector!')}
          className="px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white font-bold text-xs shadow-md hover:bg-slate-800 flex items-center gap-2 transition-all"
        >
          <Download className="w-4 h-4 text-teal-400" />
          <span>Export Map Topology</span>
        </button>
      </div>

      {/* Main Map & Info Split Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Map Visualizer Canvas */}
        <div className="lg:col-span-2 glass-card-light rounded-3xl p-6 relative overflow-hidden border border-teal-500/20 min-h-[420px] flex flex-col justify-between bg-gradient-to-br from-slate-50 via-teal-50/20 to-emerald-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
          
          {/* Map Grid Background Texture */}
          <div className="absolute inset-0 opacity-15 dark:opacity-10 pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(#0d9488 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
          </div>

          {/* Map Route Header */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2 bg-white/90 dark:bg-slate-900/90 px-3.5 py-1.5 rounded-2xl shadow-sm border border-teal-500/20">
              <Navigation className="w-4 h-4 text-teal-600 animate-pulse" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Route Topology ({stops.length} Cities)
              </span>
            </div>

            <div className="flex items-center gap-1.5 bg-white/90 dark:bg-slate-900/90 px-3 py-1 rounded-xl text-[11px] font-bold text-slate-600 dark:text-slate-300 shadow-sm">
              <Plane className="w-3.5 h-3.5 text-teal-500" />
              <span>Connected Flight Path</span>
            </div>
          </div>

          {/* SVG Flight Lines Layer */}
          <div className="relative w-full h-64 my-4">
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0d9488" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#10b981" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#d97706" stopOpacity="0.8" />
                </linearGradient>
              </defs>
              <path
                d={`M ${cityCoordinates[0].x} ${cityCoordinates[0].y} Q 28 20 ${cityCoordinates[1].x} ${cityCoordinates[1].y} T ${cityCoordinates[2].x} ${cityCoordinates[2].y} T ${cityCoordinates[3].x} ${cityCoordinates[3].y}`}
                fill="none"
                stroke="url(#routeGradient)"
                strokeWidth="2.5"
                strokeDasharray="4 3"
                className="animate-pulse-slow"
              />
            </svg>

            {/* City Pins on Map */}
            {cityCoordinates.map((coord, idx) => {
              const isSelected = activePin.city.name === coord.city.name;
              return (
                <div
                  key={idx}
                  onClick={() => setSelectedPin(coord)}
                  style={{ left: `${coord.x}%`, top: `${coord.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                >
                  <div className={`relative flex items-center justify-center p-1.5 rounded-2xl transition-all duration-300 ${
                    isSelected
                      ? 'bg-teal-600 text-white scale-125 shadow-xl shadow-teal-500/40 ring-4 ring-teal-400/30'
                      : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:scale-110 shadow-md border border-teal-500/30'
                  }`}>
                    <img
                      src={coord.city.imageUrl}
                      alt={coord.city.name}
                      className="w-7 h-7 rounded-xl object-cover"
                    />
                    <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-teal-500 text-white text-[10px] font-extrabold flex items-center justify-center shadow-sm">
                      {idx + 1}
                    </span>
                  </div>

                  {/* Pin Label Hover Box */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 px-2.5 py-1 rounded-xl bg-slate-900/90 text-white text-[11px] font-bold whitespace-nowrap shadow-lg opacity-90 group-hover:opacity-100 transition-opacity">
                    {coord.city.name}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Map Footer Route Sequence Bar */}
          <div className="relative z-10 bg-white/80 dark:bg-slate-900/80 p-3 rounded-2xl border border-teal-500/20 flex items-center justify-between overflow-x-auto gap-2 no-scrollbar">
            {cityCoordinates.map((coord, idx) => (
              <React.Fragment key={idx}>
                <div
                  onClick={() => setSelectedPin(coord)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl cursor-pointer text-xs font-bold transition-all whitespace-nowrap ${
                    activePin.city.name === coord.city.name
                      ? 'bg-teal-600 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-slate-700'
                  }`}
                >
                  <span>{idx + 1}. {coord.city.name}</span>
                </div>
                {idx < cityCoordinates.length - 1 && (
                  <span className="text-teal-500 font-extrabold text-xs">➔</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* City Detail & Flight Stats Card */}
        <div className="glass-card-light rounded-3xl p-6 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="relative h-40 rounded-2xl overflow-hidden shadow-md">
              <img
                src={activePin.city.imageUrl}
                alt={activePin.city.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-extrabold text-amber-300 border border-amber-500/30">
                ★ {activePin.city.popularity}/100 Popularity
              </div>

              <div className="absolute bottom-3 left-4">
                <h3 className="text-xl font-extrabold text-white">{activePin.city.name}</h3>
                <p className="text-xs text-slate-300 font-medium">{activePin.city.country}</p>
              </div>
            </div>

            {/* Weather & Transit Specs */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-2xl bg-teal-500/10 border border-teal-500/20">
                <span className="text-[10px] uppercase font-bold text-teal-700 dark:text-teal-300">Weather Forecast</span>
                <p className="font-extrabold text-slate-900 dark:text-white text-xs mt-0.5 flex items-center gap-1">
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  22°C Clear Sky
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20">
                <span className="text-[10px] uppercase font-bold text-purple-700 dark:text-purple-300">Cost Index</span>
                <p className="font-extrabold text-slate-900 dark:text-white text-xs mt-0.5">
                  {activePin.city.costIndex} / 100
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400">Inter-City Transit Note</span>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium flex items-center gap-2">
                <Plane className="w-4 h-4 text-teal-500 shrink-0" />
                <span>{activePin.distance || '1,100 km • 2h 10m Flight Path'}</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => onSelectCity(activePin.city)}
            className="w-full py-3 rounded-2xl gradient-btn-primary font-bold text-xs flex items-center justify-center gap-2 shadow-lg"
          >
            <MapPin className="w-4 h-4" />
            <span>View Activities in {activePin.city.name}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
