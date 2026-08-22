import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import AiAgentDrawer from './components/AiAgentDrawer';
import Dashboard from './pages/Dashboard';
import CreateTripModal from './pages/CreateTripModal';
import TripList from './pages/TripList';
import ItineraryBuilder from './pages/ItineraryBuilder';
import ItineraryView from './pages/ItineraryView';
import InteractiveMapView from './pages/InteractiveMapView';
import CityExplorer from './pages/CityExplorer';
import ActivityExplorer from './pages/ActivityExplorer';
import BudgetBreakdown from './pages/BudgetBreakdown';
import TimelineCalendar from './pages/TimelineCalendar';
import PublicTripView from './pages/PublicTripView';
import UserProfile from './pages/UserProfile';
import AdminDashboard from './pages/AdminDashboard';
import api, { MOCK_TRIPS, MOCK_CITIES } from './api/client';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [trips, setTrips] = useState(MOCK_TRIPS);
  const [selectedTrip, setSelectedTrip] = useState(MOCK_TRIPS[0]);
  const [publicTrip, setPublicTrip] = useState(MOCK_TRIPS[0]);

  // Theme & Currency States matching mockup
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currency, setCurrency] = useState('USD');

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCreateTripOpen, setIsCreateTripOpen] = useState(false);
  const [isAiAgentOpen, setIsAiAgentOpen] = useState(false);

  // Sync HTML class for dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Fetch live trips and user authentication on mount
  useEffect(() => {
    const initAuthAndData = async () => {
      const token = localStorage.getItem('globetrotter_token');
      if (token) {
        try {
          const profileRes = await api.get('/auth/me');
          if (profileRes.data && profileRes.data.user) {
            setUser(profileRes.data.user);
          }
        } catch (err) {
          console.warn('Auto-authentication failed:', err);
          localStorage.removeItem('globetrotter_token');
        }
      }
      fetchTrips();
    };
    initAuthAndData();
  }, []);

  const fetchTrips = async () => {
    try {
      const res = await api.get('/trips');
      if (res.data && res.data.trips && res.data.trips.length > 0) {
        setTrips(res.data.trips);
        setSelectedTrip(res.data.trips[0]);
      }
    } catch (err) {
      console.warn('Backend server offline or unauthenticated, using mock trip state:', err);
    }
  };

  const currencySymbol = currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : currency === 'JPY' ? '¥' : '$';

  const handleTripCreated = (newTrip) => {
    setTrips((prev) => [newTrip, ...prev]);
    setSelectedTrip(newTrip);
    setActiveTab('builder');
  };

  const handleUpdateTrip = (updatedTrip) => {
    setTrips((prev) => prev.map((t) => (t.id === updatedTrip.id ? updatedTrip : t)));
    setSelectedTrip(updatedTrip);
  };

  const handleDeleteTrip = async (tripId) => {
    try {
      await api.delete(`/trips/${tripId}`);
    } catch (err) {
      console.error('Failed to delete trip on backend:', err);
    }
    setTrips((prev) => prev.filter((t) => t.id !== tripId));
    if (selectedTrip?.id === tripId) {
      const remainingTrips = trips.filter((t) => t.id !== tripId);
      setSelectedTrip(remainingTrips.length > 0 ? remainingTrips[0] : null);
    }
  };

  const handleShareTrip = (trip) => {
    setPublicTrip(trip);
    setActiveTab('share');
  };

  const handleExportTrip = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(selectedTrip || trips[0], null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${(selectedTrip?.name || 'GlobeTrotter_Trip').replace(/\s+/g, '_')}_Itinerary.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleSaveGeneratedAiTrip = (aiPlan) => {
    const newTrip = {
      id: `trip-ai-${Date.now()}`,
      name: aiPlan.title,
      description: aiPlan.description,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
      budgetLimit: aiPlan.suggestedBudget,
      coverPhoto: aiPlan.destination.imageUrl || MOCK_CITIES[0].imageUrl,
      isPublic: true,
      shareSlug: `ai-plan-${Date.now()}`,
      stops: [
        {
          id: `stop-${Date.now()}`,
          city: aiPlan.destination,
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
          order: 1,
          activities: aiPlan.recommendedActivities.map((a, i) => ({ ...a, id: `act-ai-${i}` })),
        },
      ],
    };

    setTrips((prev) => [newTrip, ...prev]);
    setSelectedTrip(newTrip);
    setActiveTab('builder');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f4f7f6' }}>
      {/* Top Navbar matching mockup design */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenCreateTrip={() => setIsCreateTripOpen(true)}
        onToggleAiAgent={() => setIsAiAgentOpen(true)}
        trips={trips}
        selectedTrip={selectedTrip}
        onSelectTrip={(t) => setSelectedTrip(t)}
        currency={currency}
        setCurrency={setCurrency}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        onExportTrip={handleExportTrip}
      />

      {/* Main Container */}
      <main style={{ flex: 1, maxWidth: 1280, width: '100%', margin: '0 auto', padding: '24px 24px 64px' }}>
        {activeTab === 'dashboard' && (
          <Dashboard
            trips={trips}
            selectedTrip={selectedTrip}
            onSelectTrip={(t) => setSelectedTrip(t)}
            onOpenCreateTrip={() => setIsCreateTripOpen(true)}
            onToggleAiAgent={() => setIsAiAgentOpen(true)}
            onExploreCity={() => setActiveTab('cities')}
            user={user}
            currencySymbol={currencySymbol}
          />
        )}

        {activeTab === 'trips' && (
          <TripList
            trips={trips}
            onSelectTrip={(t) => {
              setSelectedTrip(t);
              setActiveTab('builder');
            }}
            onDeleteTrip={handleDeleteTrip}
            onOpenCreateTrip={() => setIsCreateTripOpen(true)}
            onShareTrip={handleShareTrip}
          />
        )}

        {activeTab === 'builder' && (
          <ItineraryBuilder
            currentTrip={selectedTrip}
            onUpdateTrip={handleUpdateTrip}
            onNavigateToView={() => setActiveTab('itinerary')}
          />
        )}

        {activeTab === 'itinerary' && (
          <ItineraryView
            currentTrip={selectedTrip}
            onShareTrip={handleShareTrip}
          />
        )}

        {activeTab === 'map' && (
          <InteractiveMapView
            currentTrip={selectedTrip}
            onSelectCity={() => setActiveTab('activities')}
          />
        )}

        {activeTab === 'cities' && (
          <CityExplorer
            onAddCityToTrip={async (city) => {
              if (selectedTrip) {
                try {
                  const res = await api.post('/stops', {
                    tripId: selectedTrip.id,
                    cityId: city.id,
                    startDate: selectedTrip.startDate,
                    endDate: selectedTrip.endDate,
                    order: (selectedTrip.stops ? selectedTrip.stops.length : 0) + 1
                  });
                  if (res.data && res.data.stop) {
                    const newStop = res.data.stop;
                    handleUpdateTrip({
                      ...selectedTrip,
                      stops: [...(selectedTrip.stops || []), newStop],
                    });
                  }
                } catch (err) {
                  console.error('Failed to save stop to backend:', err);
                  // fallback
                  const newStop = {
                    id: `stop-${Date.now()}`,
                    city,
                    startDate: selectedTrip.startDate,
                    endDate: selectedTrip.endDate,
                    order: (selectedTrip.stops ? selectedTrip.stops.length : 0) + 1,
                    activities: [],
                  };
                  handleUpdateTrip({
                    ...selectedTrip,
                    stops: [...(selectedTrip.stops || []), newStop],
                  });
                }
                setActiveTab('builder');
              } else {
                setIsCreateTripOpen(true);
              }
            }}
          />
        )}

        {activeTab === 'activities' && (
          <ActivityExplorer
            onAddActivityToTrip={async (act) => {
              if (selectedTrip && selectedTrip.stops && selectedTrip.stops.length > 0) {
                const stopToAddTo = selectedTrip.stops[0]; // defaults to first stop in demo
                try {
                  const res = await api.post('/activities', {
                    stopId: stopToAddTo.id,
                    name: act.name,
                    category: act.category,
                    cost: parseFloat(act.cost) || 0,
                    duration: parseInt(act.duration) || null,
                    description: act.description
                  });
                  if (res.data && res.data.activity) {
                    const newActivity = res.data.activity;
                    const updatedStops = [...selectedTrip.stops];
                    updatedStops[0].activities = [...(updatedStops[0].activities || []), newActivity];
                    handleUpdateTrip({ ...selectedTrip, stops: updatedStops });
                  }
                } catch (err) {
                  console.error('Failed to add activity on backend:', err);
                  // fallback
                  const updatedStops = [...selectedTrip.stops];
                  updatedStops[0].activities = [...(updatedStops[0].activities || []), { ...act, id: `act-${Date.now()}` }];
                  handleUpdateTrip({ ...selectedTrip, stops: updatedStops });
                }
                setActiveTab('builder');
              } else {
                setActiveTab('cities');
              }
            }}
          />
        )}

        {activeTab === 'budget' && (
          <BudgetBreakdown currentTrip={selectedTrip} />
        )}

        {activeTab === 'calendar' && (
          <TimelineCalendar currentTrip={selectedTrip} />
        )}

        {activeTab === 'share' && (
          <PublicTripView
            publicTrip={publicTrip || selectedTrip}
            onCopyTripToAccount={async (tripToCopy) => {
              if (tripToCopy.shareSlug) {
                try {
                  const res = await api.post(`/trips/share/${tripToCopy.shareSlug}/copy`);
                  if (res.data && res.data.tripId) {
                    const fetchRes = await api.get('/trips');
                    if (fetchRes.data && fetchRes.data.trips) {
                      setTrips(fetchRes.data.trips);
                      const newlyCopied = fetchRes.data.trips.find(t => t.id === res.data.tripId);
                      if (newlyCopied) {
                        setSelectedTrip(newlyCopied);
                        setActiveTab('builder');
                        return;
                      }
                    }
                  }
                } catch (err) {
                  console.error('Failed to copy public trip on backend:', err);
                }
              }
              const copiedTrip = {
                ...tripToCopy,
                id: `copied-${Date.now()}`,
                name: `Copy of ${tripToCopy.name}`,
              };
              setTrips((prev) => [copiedTrip, ...prev]);
              setSelectedTrip(copiedTrip);
              setActiveTab('builder');
            }}
            onBackToDashboard={() => setActiveTab('dashboard')}
          />
        )}

        {activeTab === 'profile' && (
          <UserProfile
            user={user}
            onUpdateUser={(u) => setUser(u)}
            onLogout={() => {
              localStorage.removeItem('globetrotter_token');
              setUser(null);
            }}
          />
        )}

        {activeTab === 'admin' && (
          <AdminDashboard trips={trips} />
        )}
      </main>

      {/* Global Modals & Drawers */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={(userData) => setUser(userData)}
      />

      <CreateTripModal
        isOpen={isCreateTripOpen}
        onClose={() => setIsCreateTripOpen(false)}
        onTripCreated={handleTripCreated}
      />

      <AiAgentDrawer
        isOpen={isAiAgentOpen}
        onClose={() => setIsAiAgentOpen(false)}
        onSaveGeneratedTrip={handleSaveGeneratedAiTrip}
      />
    </div>
  );
}
