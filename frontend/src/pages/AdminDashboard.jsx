import React from 'react';
import { Shield, Users, Compass, Globe, DollarSign, TrendingUp, Activity } from 'lucide-react';
import { MOCK_CITIES } from '../api/client';

export default function AdminDashboard({ trips }) {
  const totalUsers = 1420;
  const totalTrips = trips.length + 850;
  const topCities = MOCK_CITIES.slice(0, 5);

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Shield className="w-7 h-7 text-purple-400" />
          Admin Platform Analytics & Control Center
        </h1>
        <p className="text-xs text-slate-400">Track user engagement, popular destinations, and system metrics</p>
      </div>

      {/* Analytics Counter Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="glass-card rounded-3xl p-5 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Active Users</span>
            <Users className="w-5 h-5 text-cyan-400" />
          </div>
          <h3 className="text-2xl font-extrabold text-white mt-2">{totalUsers.toLocaleString()}</h3>
          <span className="text-[10px] text-emerald-400 font-bold">+12% this week</span>
        </div>

        <div className="glass-card rounded-3xl p-5 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Total Itineraries</span>
            <Compass className="w-5 h-5 text-purple-400" />
          </div>
          <h3 className="text-2xl font-extrabold text-white mt-2">{totalTrips.toLocaleString()}</h3>
          <span className="text-[10px] text-purple-400 font-bold">+28 new today</span>
        </div>

        <div className="glass-card rounded-3xl p-5 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Cities Catalog</span>
            <Globe className="w-5 h-5 text-emerald-400" />
          </div>
          <h3 className="text-2xl font-extrabold text-white mt-2">128 Cities</h3>
          <span className="text-[10px] text-slate-400">Across 45 Countries</span>
        </div>

        <div className="glass-card rounded-3xl p-5 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Avg Spend / Trip</span>
            <DollarSign className="w-5 h-5 text-amber-400" />
          </div>
          <h3 className="text-2xl font-extrabold text-white mt-2">$2,850</h3>
          <span className="text-[10px] text-emerald-400 font-bold">Optimal budget range</span>
        </div>
      </div>

      {/* Top Destinations Table */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-cyan-400" />
          Top Booked Destinations
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-slate-400 border-b border-slate-800 uppercase font-bold text-[10px]">
                <th className="pb-3">Destination</th>
                <th className="pb-3">Country</th>
                <th className="pb-3">Cost Index</th>
                <th className="pb-3">Popularity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {topCities.map((city) => (
                <tr key={city.id} className="text-slate-200 hover:bg-slate-900/60 transition-colors">
                  <td className="py-3 font-bold text-white flex items-center gap-2">
                    <img src={city.imageUrl} alt={city.name} className="w-7 h-7 rounded-lg object-cover" />
                    {city.name}
                  </td>
                  <td className="py-3 text-slate-400">{city.country}</td>
                  <td className="py-3 font-bold text-emerald-400">{city.costIndex}</td>
                  <td className="py-3 font-bold text-amber-300">★ {city.popularity}/100</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
