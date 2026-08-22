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
  // Sync tab with URL hash
  const getInitialTab = () => {
    const hash = window.location.hash.replace(/^#\/?/, '');
    const validTabs = ['dashboard', 'trips', 'builder', 'itinerary', 'cities', 'activities', 'budget', 'calendar', 'map', 'share', 'profile', 'admin'];
    return validTabs.includes(hash) ? hash : 'dashboard';
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);
  const [user, setUser] = useState({ id: 'user-1', name: 'Aarav Sharma', email: 'aarav.sharma@odoo-hackathon.in' });
  const [trips, setTrips] = useState(MOCK_TRIPS);
  const [selectedTrip, setSelectedTrip] = useState(MOCK_TRIPS[0]);
  const [publicTrip, setPublicTrip] = useState(MOCK_TRIPS[0]);

  // Currency & Theme - Defaults to INR (₹)
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currency, setCurrency] = useState('INR');

  const currencySymbol = currency === 'INR' ? '₹' : (currency === 'EUR' ? '€' : (currency === 'GBP' ? '£' : (currency === 'JPY' ? '¥' : '$')));

  // Modals & Drawers
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCreateTripOpen, setIsCreateTripOpen] = useState(false);
  const [isAiAgentOpen, setIsAiAgentOpen] = useState(false);

  // Synchronize Tab with URL hash bidirectionally
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, '');
      const validTabs = ['dashboard', 'trips', 'builder', 'itinerary', 'cities', 'activities', 'budget', 'calendar', 'map', 'share', 'profile', 'admin'];
      if (validTabs.includes(hash) && hash !== activeTab) {
        setActiveTab(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [activeTab]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    window.location.hash = `#/${tabId}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
        setPublicTrip(res.data.trips[0]);
      }
    } catch (err) {
      console.log('Using pre-populated Indian & global trip templates:', err.message);
    }
  };

  const handleUpdateTrip = (updatedTrip) => {
    setTrips((prev) =>
      prev.map((t) => (t.id === updatedTrip.id ? updatedTrip : t))
    );
    if (selectedTrip?.id === updatedTrip.id) {
      setSelectedTrip(updatedTrip);
    }
  };

  const handleDeleteTrip = async (tripId) => {
    try {
      await api.delete(`/trips/${tripId}`);
    } catch (err) {
      console.error('Failed to delete trip on backend:', err);
    }
    const filtered = trips.filter((t) => t.id !== tripId);
    setTrips(filtered);
    if (selectedTrip?.id === tripId) {
      setSelectedTrip(filtered[0] || null);
    }
  };

  const handleShareTrip = (trip) => {
    setPublicTrip(trip);
    handleTabChange('share');
  };

  const handleExportTrip = () => {
    const targetTrip = selectedTrip || trips[0];
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(targetTrip, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${(targetTrip?.name || 'GlobeTrotter_Trip').replace(/\s+/g, '_')}_Itinerary.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleSaveGeneratedAiTrip = (aiPlan) => {
    const newTrip = {
      id: `trip-ai-${Date.now()}`,
      name: aiPlan.title || 'Customized Royal Journey',
      description: aiPlan.description || 'Curated personalized journey generated by GlobeTrotter AI engine.',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      budgetLimit: aiPlan.suggestedBudget || 35000,
      coverPhoto: aiPlan.destination?.imageUrl || MOCK_CITIES[0].imageUrl,
      isPublic: true,
      shareSlug: `ai-plan-${Date.now()}`,
      stops: [
        {
          id: `stop-${Date.now()}`,
          city: aiPlan.destination || MOCK_CITIES[0],
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
          order: 1,
          activities: (aiPlan.recommendedActivities || []).map((a, i) => ({ ...a, id: `act-ai-${i}-${Date.now()}` })),
        },
      ],
    };

    setTrips((prev) => [newTrip, ...prev]);
    setSelectedTrip(newTrip);
    handleTabChange('builder');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
      {/* 2-Tier High-Impact Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
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

      {/* Main Content Area */}
      <main style={{ flex: 1, maxWidth: 1440, width: '100%', margin: '0 auto', padding: '24px 24px 80px' }}>
        {activeTab === 'dashboard' && (
          <Dashboard
            trips={trips}
            selectedTrip={selectedTrip}
            onSelectTrip={(t) => setSelectedTrip(t)}
            onOpenCreateTrip={() => setIsCreateTripOpen(true)}
            onToggleAiAgent={() => setIsAiAgentOpen(true)}
            onExploreCity={() => handleTabChange('cities')}
            onNavigateTab={handleTabChange}
            user={user}
            currencySymbol={currencySymbol}
          />
        )}

        {activeTab === 'trips' && (
          <TripList
            trips={trips}
            onSelectTrip={(t) => {
              setSelectedTrip(t);
              handleTabChange('builder');
            }}
            onDeleteTrip={handleDeleteTrip}
            onOpenCreateTrip={() => setIsCreateTripOpen(true)}
            onShareTrip={handleShareTrip}
            currencySymbol={currencySymbol}
          />
        )}

        {activeTab === 'builder' && (
          <ItineraryBuilder
            currentTrip={selectedTrip}
            onUpdateTrip={handleUpdateTrip}
            onNavigateToView={() => handleTabChange('itinerary')}
            currencySymbol={currencySymbol}
          />
        )}

        {activeTab === 'itinerary' && (
          <ItineraryView
            currentTrip={selectedTrip}
            onShareTrip={handleShareTrip}
            onNavigateToBuilder={() => handleTabChange('builder')}
            currencySymbol={currencySymbol}
            onExportTrip={handleExportTrip}
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
                handleTabChange('builder');
              } else {
                setIsCreateTripOpen(true);
              }
            }}
            currencySymbol={currencySymbol}
          />
        )}

        {activeTab === 'activities' && (
          <ActivityExplorer
            onAddActivityToTrip={async (act) => {
              if (selectedTrip && selectedTrip.stops && selectedTrip.stops.length > 0) {
                const stopToAddTo = selectedTrip.stops[selectedTrip.stops.length - 1]; // add to most recent stop
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
                    const updatedStops = selectedTrip.stops.map((s) =>
                      s.id === stopToAddTo.id
                        ? { ...s, activities: [...(s.activities || []), newActivity] }
                        : s
                    );
                    handleUpdateTrip({ ...selectedTrip, stops: updatedStops });
                  }
                } catch (err) {
                  console.error('Failed to add activity on backend:', err);
                  const updatedStops = selectedTrip.stops.map((s) =>
                    s.id === stopToAddTo.id
                      ? { ...s, activities: [...(s.activities || []), { ...act, id: `act-${Date.now()}` }] }
                      : s
                  );
                  handleUpdateTrip({ ...selectedTrip, stops: updatedStops });
                }
                handleTabChange('builder');
              } else {
                alert('Please create or select a trip first from the Navbar!');
              }
            }}
            currencySymbol={currencySymbol}
          />
        )}

        {activeTab === 'budget' && (
          <BudgetBreakdown
            currentTrip={selectedTrip}
            onNavigateToBuilder={() => handleTabChange('builder')}
            currencySymbol={currencySymbol}
          />
        )}

        {activeTab === 'calendar' && (
          <TimelineCalendar
            currentTrip={selectedTrip}
            currencySymbol={currencySymbol}
          />
        )}

        {activeTab === 'map' && (
          <InteractiveMapView
            currentTrip={selectedTrip}
            onSelectCity={(city) => {
              handleTabChange('activities');
            }}
            currencySymbol={currencySymbol}
          />
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
                        handleTabChange('builder');
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
              handleTabChange('builder');
            }}
            currencySymbol={currencySymbol}
          />
        )}

        {activeTab === 'profile' && (
          <UserProfile
            user={user}
            trips={trips}
            currency={currency}
            setCurrency={setCurrency}
            onUpdateUser={(u) => setUser(u)}
            onLogout={() => {
              localStorage.removeItem('globetrotter_token');
              setUser(null);
            }}
            onNavigateTab={handleTabChange}
          />
        )}

        {activeTab === 'admin' && (
          <AdminDashboard
            trips={trips}
            currencySymbol={currencySymbol}
          />
        )}
      </main>

      {/* Modals & AI Agent Drawer */}
      <CreateTripModal
        isOpen={isCreateTripOpen}
        onClose={() => setIsCreateTripOpen(false)}
        onTripCreated={(newTrip) => {
          setTrips((prev) => [newTrip, ...prev]);
          setSelectedTrip(newTrip);
          handleTabChange('builder');
        }}
        currencySymbol={currencySymbol}
      />

      <AiAgentDrawer
        isOpen={isAiAgentOpen}
        onClose={() => setIsAiAgentOpen(false)}
        onSaveGeneratedTrip={handleSaveGeneratedAiTrip}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={(userData) => {
          setUser(userData);
          setIsAuthOpen(false);
        }}
      />
    </div>
  );
}