import React, { useState, useEffect, useRef } from 'react';
import {
  Compass, Navigation, MapPin, Layers, ZoomIn, ZoomOut,
  Maximize2, Download, Sun, DollarSign, ArrowRight, Plane,
  Train, Sparkles, CheckCircle2
} from 'lucide-react';
import L from 'leaflet';
import { MOCK_CITIES } from '../api/client';

// Real-World Geographic Coordinates Database (Lat, Lng)
const CITY_GEO_COORDS = {
  'jaipur': [26.9124, 75.7873],
  'udaipur': [24.5854, 73.7125],
  'goa': [15.2993, 74.1240],
  'munnar & alleppey': [9.4981, 76.3388],
  'munnar': [10.0889, 77.0595],
  'alleppey': [9.4981, 76.3388],
  'manali & ladakh': [32.2432, 77.1892],
  'manali': [32.2432, 77.1892],
  'ladakh': [34.1526, 77.5771],
  'varanasi': [25.3176, 82.9739],
  'mumbai': [19.0760, 72.8777],
  'agra & delhi': [27.1767, 78.0081],
  'agra': [27.1767, 78.0081],
  'delhi': [28.6139, 77.2090],
  'dubai': [25.2048, 55.2708],
  'bali': [-8.4095, 115.1889],
  'paris': [48.8566, 2.3522],
  'tokyo': [35.6762, 139.6503],
  'singapore': [1.3521, 103.8198],
  'rome': [41.9028, 12.4964],
  'barcelona': [41.3879, 2.1699],
  'london': [51.5074, -0.1278],
  'new york': [40.7128, -74.0060],
};

const TILE_LAYERS = {
  voyager: {
    name: '🎨 Vibrant Voyager',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap'
  },
  osm: {
    name: '🗺️ OpenStreetMap',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
  },
  satellite: {
    name: '🛰️ Satellite Imagery',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri, Earthstar Geographics'
  },
  dark: {
    name: '🌙 Dark Mode GIS',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; CARTO &copy; OpenStreetMap'
  }
};

export default function InteractiveMapView({
  currentTrip,
  onSelectCity,
  currencySymbol = '₹'
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layerGroupRef = useRef(null);
  const polylineRef = useRef(null);

  const [activeTileKey, setActiveTileKey] = useState('voyager');
  const [selectedStop, setSelectedStop] = useState(null);

  const stops = (currentTrip && currentTrip.stops && currentTrip.stops.length > 0)
    ? currentTrip.stops
    : [
        { id: 's1', city: MOCK_CITIES[0], startDate: '2026-10-01', endDate: '2026-10-04', order: 1 },
        { id: 's2', city: MOCK_CITIES[5], startDate: '2026-10-04', endDate: '2026-10-07', order: 2 },
      ];

  // Helper to find coords
  const getCityCoords = (cityObj) => {
    const cityName = (cityObj?.name || cityObj || '').toLowerCase().trim();
    if (CITY_GEO_COORDS[cityName]) return CITY_GEO_COORDS[cityName];
    for (const [key, coords] of Object.entries(CITY_GEO_COORDS)) {
      if (cityName.includes(key) || key.includes(cityName)) {
        return coords;
      }
    }
    return [20.5937, 78.9629]; // Default center of India
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const firstCoords = getCityCoords(stops[0]?.city || MOCK_CITIES[0]);

    const map = L.map(mapContainerRef.current, {
      center: firstCoords,
      zoom: stops.length > 1 ? 5 : 6,
      zoomControl: false,
      attributionControl: false
    });

    // Add Tile Layer
    const tileConfig = TILE_LAYERS[activeTileKey];
    L.tileLayer(tileConfig.url, {
      attribution: tileConfig.attribution,
      maxZoom: 19
    }).addTo(map);

    // Create Layer Group for Pins and Polylines
    const layerGroup = L.layerGroup().addTo(map);
    layerGroupRef.current = layerGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [activeTileKey]);

  // Render Markers and Flight Paths whenever stops or trip changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    const stopCoordinates = [];

    stops.forEach((stop, idx) => {
      const cityObj = stop.city?.name ? stop.city : (MOCK_CITIES.find(c => c.name === stop.city) || MOCK_CITIES[0]);
      const coords = getCityCoords(cityObj);
      stopCoordinates.push(coords);

      const isSelected = selectedStop?.id === stop.id || (!selectedStop && idx === 0);

      // Create Custom HTML Pin Icon
      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div style="
            position: relative;
            cursor: pointer;
            transform: translate(-50%, -50%);
            display: flex;
            align-items: center;
            gap: 6px;
            background: ${isSelected ? '#0d9488' : '#ffffff'};
            color: ${isSelected ? '#ffffff' : '#0f172a'};
            padding: 4px 10px 4px 4px;
            border-radius: 99px;
            box-shadow: 0 4px 16px rgba(0,0,0,0.25);
            border: 2px solid ${isSelected ? '#ffffff' : '#0d9488'};
            font-family: Inter, sans-serif;
            font-weight: 800;
            font-size: 11px;
            white-space: nowrap;
          ">
            <div style="
              width: 22px; height: 22px; border-radius: 50%;
              background: ${isSelected ? '#ffffff' : '#0d9488'};
              color: ${isSelected ? '#0d9488' : '#ffffff'};
              display: flex; align-items: center; justify-content: center;
              font-size: 11px; font-weight: 900;
            ">
              ${idx + 1}
            </div>
            <span>${cityObj.name}</span>
          </div>
        `,
        iconSize: [100, 30],
        iconAnchor: [50, 15]
      });

      const marker = L.marker(coords, { icon: customIcon }).addTo(layerGroup);

      marker.on('click', () => {
        setSelectedStop(stop);
        map.panTo(coords, { animate: true, duration: 0.6 });
      });

      // Bind rich popup
      marker.bindPopup(`
        <div style="font-family: Inter, sans-serif; padding: 4px; min-width: 180px;">
          <div style="font-weight: 900; font-size: 14px; color: #0f172a; margin-bottom: 2px;">
            ${idx + 1}. ${cityObj.name}
          </div>
          <div style="font-size: 11px; color: #64748b; margin-bottom: 8px;">
            ${cityObj.country} · ${stop.activities?.length || 0} Scheduled Activities
          </div>
          <div style="font-size: 11px; color: #0d9488; font-weight: 700; background: #f0fdf9; padding: 4px 8px; border-radius: 6px;">
            💰 Avg ${currencySymbol}${cityObj.costPerDay || 2500}/day
          </div>
        </div>
      `);
    });

    // Draw Flight Route Polyline with Glow
    if (stopCoordinates.length > 1) {
      // Background glow line
      L.polyline(stopCoordinates, {
        color: '#10b981',
        weight: 6,
        opacity: 0.3,
        lineCap: 'round'
      }).addTo(layerGroup);

      // Foreground dashed route line
      L.polyline(stopCoordinates, {
        color: '#0d9488',
        weight: 3,
        dashArray: '6, 8',
        opacity: 0.9,
        lineCap: 'round'
      }).addTo(layerGroup);

      // Fit map bounds to show all stops
      try {
        const bounds = L.latLngBounds(stopCoordinates);
        map.fitBounds(bounds, { padding: [60, 60], maxZoom: 8 });
      } catch (e) {}
    }

    if (!selectedStop && stops[0]) {
      setSelectedStop(stops[0]);
    }
  }, [stops, selectedStop]);

  const activeCityObj = selectedStop?.city?.name
    ? selectedStop.city
    : (MOCK_CITIES.find(c => c.name === selectedStop?.city) || stops[0]?.city || MOCK_CITIES[0]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* 1. Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #042f2e 0%, #064e3b 40%, #0f172a 100%)',
        borderRadius: '24px', padding: '32px 36px',
        position: 'relative', overflow: 'hidden',
        boxShadow: '0 12px 36px -8px rgba(4, 47, 46, 0.4)',
        border: '1px solid rgba(16, 185, 129, 0.2)'
      }}>
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.35)', borderRadius: '99px', padding: '4px 12px', marginBottom: '10px' }}>
              <Compass size={12} color="#34d399" />
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#6ee7b7', letterSpacing: '0.05em' }}>
                GLOBAL & INDIAN GIS MAP ENGINE
              </span>
            </div>

            <h1 style={{ fontSize: '30px', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.5px', margin: 0 }}>
              Interactive World Map & Flight Topology
            </h1>

            <p style={{ fontSize: '13px', color: '#cbd5e1', marginTop: '6px' }}>
              Real-world OpenStreetMap vector tiles, GPS coordinates, interactive city pins, and route connectors.
            </p>
          </div>

          {/* Map Layer Switcher */}
          <div style={{ display: 'flex', gap: '6px', background: 'rgba(255,255,255,0.12)', borderRadius: '12px', padding: '4px', border: '1px solid rgba(255,255,255,0.2)' }}>
            {Object.entries(TILE_LAYERS).map(([key, config]) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveTileKey(key)}
                style={{
                  padding: '6px 12px', borderRadius: '8px',
                  fontSize: '11px', fontWeight: 800,
                  background: activeTileKey === key ? '#ffffff' : 'transparent',
                  color: activeTileKey === key ? '#0f172a' : '#ffffff',
                  border: 'none', cursor: 'pointer',
                  boxShadow: activeTileKey === key ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                {config.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Main Map & Inspector Split View */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        
        {/* Real Leaflet Map Container */}
        <div style={{
          gridColumn: 'span 2',
          background: '#ffffff', borderRadius: '24px',
          border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
          position: 'relative', overflow: 'hidden', minHeight: '520px',
          display: 'flex', flexDirection: 'column'
        }}>
          {/* Top Floating Controls Bar */}
          <div style={{
            position: 'absolute', top: '16px', left: '16px', right: '16px', zIndex: 500,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', pointerEvents: 'none'
          }}>
            <div style={{
              background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)',
              padding: '6px 14px', borderRadius: '12px', border: '1px solid #cbd5e1',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)', pointerEvents: 'auto',
              display: 'flex', alignItems: 'center', gap: '8px'
            }}>
              <Navigation size={14} color="#0d9488" />
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#0f766e' }}>
                {currentTrip?.name || 'Active Itinerary'} ({stops.length} Cities Connected)
              </span>
            </div>

            <div style={{ display: 'flex', gap: '6px', pointerEvents: 'auto' }}>
              <button
                type="button"
                onClick={() => {
                  if (mapInstanceRef.current) {
                    mapInstanceRef.current.zoomIn();
                  }
                }}
                style={{
                  width: '34px', height: '34px', borderRadius: '10px',
                  background: '#ffffff', border: '1px solid #cbd5e1',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              >
                <ZoomIn size={15} color="#334155" />
              </button>

              <button
                type="button"
                onClick={() => {
                  if (mapInstanceRef.current) {
                    mapInstanceRef.current.zoomOut();
                  }
                }}
                style={{
                  width: '34px', height: '34px', borderRadius: '10px',
                  background: '#ffffff', border: '1px solid #cbd5e1',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              >
                <ZoomOut size={15} color="#334155" />
              </button>
            </div>
          </div>

          {/* Actual Leaflet GIS Canvas */}
          <div ref={mapContainerRef} style={{ width: '100%', height: '520px', zIndex: 1 }} />

          {/* Bottom Route Sequence Bar */}
          <div style={{
            background: '#ffffff', padding: '12px 20px', borderTop: '1px solid #e2e8f0',
            display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', zIndex: 10
          }}>
            {stops.map((st, idx) => {
              const cityName = st.city?.name || st.city || 'City';
              const isSelected = selectedStop?.id === st.id;

              return (
                <React.Fragment key={st.id || idx}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedStop(st);
                      const coords = getCityCoords(st.city);
                      if (mapInstanceRef.current) {
                        mapInstanceRef.current.panTo(coords, { animate: true, duration: 0.6 });
                      }
                    }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      padding: '6px 12px', borderRadius: '10px', fontSize: '12px', fontWeight: 800,
                      background: isSelected ? 'linear-gradient(135deg, #0d9488, #10b981)' : '#f8fafc',
                      color: isSelected ? '#ffffff' : '#334155',
                      border: isSelected ? 'none' : '1px solid #cbd5e1', cursor: 'pointer', whiteSpace: 'nowrap'
                    }}
                  >
                    <span>{idx + 1}. {cityName}</span>
                  </button>
                  {idx < stops.length - 1 && (
                    <span style={{ color: '#0d9488', fontWeight: 900 }}>➔</span>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Selected City Inspector Card */}
        {activeCityObj && (
          <div style={{
            background: '#ffffff', borderRadius: '24px', padding: '24px',
            border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '18px'
          }}>
            <div>
              <div style={{ height: '170px', borderRadius: '16px', overflow: 'hidden', position: 'relative', marginBottom: '14px' }}>
                <img
                  src={activeCityObj.imageUrl}
                  alt={activeCityObj.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.75)', color: '#ffffff', borderRadius: '99px', padding: '3px 10px', fontSize: '11px', fontWeight: 800 }}>
                  ★ {activeCityObj.popularity || 98}/100 Popularity
                </div>

                <div style={{ position: 'absolute', bottom: '10px', left: '12px', background: 'rgba(15,23,42,0.85)', padding: '3px 8px', borderRadius: '6px', color: '#a7f3d0', fontSize: '11px', fontWeight: 800 }}>
                  📍 {activeCityObj.country}
                </div>
              </div>

              <h3 style={{ fontSize: '22px', fontWeight: 900, color: '#0f172a', margin: '0 0 4px' }}>
                {activeCityObj.name}
              </h3>
              <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.5, margin: '0 0 14px' }}>
                {activeCityObj.desc || activeCityObj.description || 'Vibrant travel destination featuring cultural landmarks, local cuisine, and heritage.'}
              </p>

              {/* Weather & Spending Indicator */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
                <div style={{ background: '#f0fdf9', padding: '10px', borderRadius: '12px', border: '1px solid #a7f3d0' }}>
                  <div style={{ fontSize: '10px', fontWeight: 800, color: '#0f766e', textTransform: 'uppercase' }}>Live Weather</div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Sun size={14} color="#f59e0b" />
                    <span>26°C Clear</span>
                  </div>
                </div>

                <div style={{ background: '#fffbeb', padding: '10px', borderRadius: '12px', border: '1px solid #fde68a' }}>
                  <div style={{ fontSize: '10px', fontWeight: 800, color: '#92400e', textTransform: 'uppercase' }}>Daily Cost</div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                    {currencySymbol}{(activeCityObj.costPerDay || 2500).toLocaleString()}/day
                  </div>
                </div>
              </div>

              {/* Stop Scheduled Experiences Count */}
              <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px', color: '#475569', fontWeight: 600 }}>
                🎯 <strong>{selectedStop?.activities?.length || 0}</strong> experiences scheduled in this stop.
              </div>
            </div>

            <button
              type="button"
              onClick={() => onSelectCity(activeCityObj)}
              style={{
                width: '100%', padding: '13px', borderRadius: '14px',
                background: 'linear-gradient(135deg, #0d9488 0%, #10b981 100%)',
                color: '#ffffff', border: 'none', fontSize: '13px', fontWeight: 800,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                boxShadow: '0 4px 14px rgba(13,148,136,0.35)'
              }}
            >
              <MapPin size={16} />
              <span>Explore Activities in {activeCityObj.name}</span>
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
