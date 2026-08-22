import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import Header from './components/Header';
import HeroBanner from './components/HeroBanner';
import ItineraryBuilder from './components/ItineraryBuilder';
import RouteMapVisualizer from './components/RouteMapVisualizer';
import BudgetSummary from './components/BudgetSummary';
import AddCityModal from './components/AddCityModal';

const PRESETS = {
  europe: [
    {
      id: 'euro-1',
      name: 'Paris',
      country: 'France',
      days: 3,
      costPerNight: 160,
      highlight: 'Eiffel Tower & Louvre Museum',
      weather: '☀️ 22°C Clear',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80',
      lat: 48.8566,
      lng: 2.3522,
      arrivalDate: '2026-09-01',
      departureDate: '2026-09-04',
      activities: [
        { title: 'Eiffel Tower Sunset Tour', category: 'sightseeing' },
        { title: 'Louvre Art Gallery Pass', category: 'sightseeing' },
        { title: 'French Bakery & Wine Tasting', category: 'food' }
      ],
      transportToNext: { type: 'flight', duration: '2h 05m', cost: 110, distance: '1,105 km' }
    },
    {
      id: 'euro-2',
      name: 'Rome',
      country: 'Italy',
      days: 3,
      costPerNight: 135,
      highlight: 'Colosseum & Trevi Fountain',
      weather: '🌤️ 26°C Sunny',
      image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80',
      lat: 41.9028,
      lng: 12.4964,
      arrivalDate: '2026-09-04',
      departureDate: '2026-09-07',
      activities: [
        { title: 'Colosseum & Forum Skip line', category: 'sightseeing' },
        { title: 'Vatican Museums & Sistine', category: 'sightseeing' },
        { title: 'Trastevere Pasta Masterclass', category: 'food' }
      ],
      transportToNext: { type: 'flight', duration: '1h 50m', cost: 95, distance: '858 km' }
    },
    {
      id: 'euro-3',
      name: 'Barcelona',
      country: 'Spain',
      days: 4,
      costPerNight: 125,
      highlight: 'Sagrada Família & Park Güell',
      weather: '☀️ 27°C Coastal Breeze',
      image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=600&q=80',
      lat: 41.3851,
      lng: 2.1734,
      arrivalDate: '2026-09-07',
      departureDate: '2026-09-11',
      activities: [
        { title: 'Sagrada Família Guided Tour', category: 'sightseeing' },
        { title: 'Gothic Quarter Tapas Crawl', category: 'food' },
        { title: 'Barceloneta Beach Sunset Sailing', category: 'adventure' }
      ],
      transportToNext: { type: 'flight', duration: '2h 20m', cost: 130, distance: '1,240 km' }
    },
    {
      id: 'euro-4',
      name: 'Amsterdam',
      country: 'Netherlands',
      days: 3,
      costPerNight: 155,
      highlight: 'Canal Cruise & Van Gogh Museum',
      weather: '⛅ 19°C Mild',
      image: 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=600&q=80',
      lat: 52.3676,
      lng: 4.9041,
      arrivalDate: '2026-09-11',
      departureDate: '2026-09-14',
      activities: [
        { title: 'Historic Canal Boat Cruise', category: 'sightseeing' },
        { title: 'Rijksmuseum & Van Gogh Museum', category: 'sightseeing' },
        { title: 'Dutch Cheese & Stroopwafel Tasting', category: 'food' }
      ]
    }
  ],
  asia: [
    {
      id: 'asia-1',
      name: 'Tokyo',
      country: 'Japan',
      days: 4,
      costPerNight: 175,
      highlight: 'Shibuya Crossing & Mt. Fuji Trip',
      weather: '☀️ 21°C Pleasant',
      image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80',
      lat: 35.6762,
      lng: 139.6503,
      arrivalDate: '2026-10-01',
      departureDate: '2026-10-05',
      activities: [
        { title: 'Shibuya & Harajuku Exploration', category: 'sightseeing' },
        { title: 'Tsukiji Market Ramen & Sushi', category: 'food' },
        { title: 'teamLab Planets Digital Art', category: 'adventure' }
      ],
      transportToNext: { type: 'train', duration: '2h 15m', cost: 130, distance: '450 km' }
    },
    {
      id: 'asia-2',
      name: 'Kyoto',
      country: 'Japan',
      days: 3,
      costPerNight: 145,
      highlight: 'Fushimi Inari & Bamboo Forest',
      weather: '🌸 20°C Scenic',
      image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80',
      lat: 35.0116,
      lng: 135.7681,
      arrivalDate: '2026-10-05',
      departureDate: '2026-10-08',
      activities: [
        { title: 'Arashiyama Bamboo Grove Walk', category: 'adventure' },
        { title: 'Fushimi Inari Shrine Hike', category: 'sightseeing' },
        { title: 'Kimono Experience & Tea Ceremony', category: 'food' }
      ]
    }
  ],
  mediterranean: [
    {
      id: 'med-1',
      name: 'Florence',
      country: 'Italy',
      days: 3,
      costPerNight: 140,
      highlight: 'Duomo & Uffizi Gallery',
      weather: '☀️ 25°C Sunny',
      image: 'https://images.unsplash.com/photo-1543429776-2782fc8e1acd?auto=format&fit=crop&w=600&q=80',
      lat: 43.7696,
      lng: 11.2558,
      arrivalDate: '2026-09-15',
      departureDate: '2026-09-18',
      activities: [
        { title: 'Tuscan Countryside Wine Tour', category: 'food' },
        { title: 'Michelangelo David & Uffizi', category: 'sightseeing' }
      ],
      transportToNext: { type: 'train', duration: '2h 00m', cost: 45, distance: '260 km' }
    },
    {
      id: 'med-2',
      name: 'Venice',
      country: 'Italy',
      days: 2,
      costPerNight: 165,
      highlight: 'Grand Canal & Gondola',
      weather: '🌤️ 23°C Pleasant',
      image: 'https://images.unsplash.com/photo-1514890547357-a9ee288728e0?auto=format&fit=crop&w=600&q=80',
      lat: 45.4408,
      lng: 12.3155,
      arrivalDate: '2026-09-18',
      departureDate: '2026-09-20',
      activities: [
        { title: 'Sunset Gondola Ride on Grand Canal', category: 'sightseeing' },
        { title: 'Murano Glass blowing Workshop', category: 'adventure' }
      ]
    }
  ]
};

export default function App() {
  const [activeTab, setActiveTab] = useState('timeline');
  const [selectedPreset, setSelectedPreset] = useState('europe');
  const [cities, setCities] = useState(PRESETS.europe);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const [currency, setCurrency] = useState('USD');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const handlePresetSelect = (presetKey) => {
    setSelectedPreset(presetKey);
    if (PRESETS[presetKey]) {
      setCities(PRESETS[presetKey]);
    }
  };

  const handleMoveCity = (index, direction) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= cities.length) return;
    const newCities = [...cities];
    const temp = newCities[index];
    newCities[index] = newCities[targetIdx];
    newCities[targetIdx] = temp;
    setCities(newCities);
  };

  const handleDeleteCity = (id) => {
    setCities(cities.filter(c => c.id !== id));
  };

  const handleDaysChange = (id, delta) => {
    setCities(cities.map(c => {
      if (c.id === id) {
        const newDays = Math.max(1, c.days + delta);
        return { ...c, days: newDays };
      }
      return c;
    }));
  };

  const handleAddCity = (cityData) => {
    setCities([...cities, cityData]);
  };

  const handleAddActivity = (cityId) => {
    const actName = prompt('Enter activity or attraction name:');
    if (!actName) return;
    setCities(cities.map(c => {
      if (c.id === cityId) {
        return {
          ...c,
          activities: [...c.activities, { title: actName, category: 'sightseeing' }]
        };
      }
      return c;
    }));
  };

  const handleRemoveActivity = (cityId, activityIndex) => {
    setCities(cities.map(c => {
      if (c.id === cityId) {
        const newActs = [...c.activities];
        newActs.splice(activityIndex, 1);
        return { ...c, activities: newActs };
      }
      return c;
    }));
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(cities, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `GlobeTrotter_Itinerary_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.55 }
    });
  };

  return (
    <div className="app-container">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onExport={handleExport}
        onPresetSelect={handlePresetSelect}
        selectedPreset={selectedPreset}
        theme={theme}
        onToggleTheme={toggleTheme}
        currency={currency}
        setCurrency={setCurrency}
      />

      <HeroBanner 
        cities={cities} 
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      <main>
        {activeTab === 'timeline' && (
          <ItineraryBuilder
            cities={cities}
            onMoveCity={handleMoveCity}
            onDeleteCity={handleDeleteCity}
            onDaysChange={handleDaysChange}
            onOpenAddModal={() => setIsAddModalOpen(true)}
            onAddActivity={handleAddActivity}
            onRemoveActivity={handleRemoveActivity}
            currency={currency}
          />
        )}

        {activeTab === 'map' && (
          <RouteMapVisualizer cities={cities} />
        )}

        {activeTab === 'budget' && (
          <BudgetSummary cities={cities} currency={currency} />
        )}
      </main>

      <AddCityModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddCity={handleAddCity}
      />
    </div>
  );
}
