import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, getProfile, getSavedLocations, getExplorationHistory } from '../services/supabaseClient';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Auth state
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // App state
  const [selectedCity, setSelectedCity] = useState(null);
  const [savedLocations, setSavedLocations] = useState([]);
  const [explorationHistory, setExplorationHistory] = useState([]);
  const [sidePanel, setSidePanel] = useState({ open: false, tab: 'weather' });

  // Map state
  const [mapCenter, setMapCenter] = useState({ lng: -99.1332, lat: 19.4326 }); // CDMX default
  const [mapZoom, setMapZoom] = useState(3);

  useEffect(() => {
    // Obtener sesión actual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserData(session.user.id);
      }
      setLoading(false);
    });

    // Escuchar cambios de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        if (event === 'SIGNED_IN' && session?.user) {
          loadUserData(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setProfile(null);
          setSavedLocations([]);
          setExplorationHistory([]);
        } else if (event === 'USER_UPDATED' && session?.user) {
          loadUserData(session.user.id);
        } else if (event === 'PASSWORD_RECOVERY') {
          // Supabase maneja esto internamente, el usuario llegara a la pagina de reset
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);


  const loadUserData = useCallback(async (userId) => {
    try {
      const [profileRes, locationsRes, historyRes] = await Promise.all([
        getProfile(userId),
        getSavedLocations(userId),
        getExplorationHistory(userId)
      ]);

      if (profileRes.data) setProfile(profileRes.data);
      if (locationsRes.data) setSavedLocations(locationsRes.data);
      if (historyRes.data) setExplorationHistory(historyRes.data);
    } catch (error) {
      console.error('Error cargando datos del usuario:', error);
    }
  }, []);

  const refreshLocations = useCallback(async () => {
    if (!user) return;
    const { data } = await getSavedLocations(user.id);
    if (data) setSavedLocations(data);
  }, [user]);

  const refreshHistory = useCallback(async () => {
    if (!user) return;
    const { data } = await getExplorationHistory(user.id);
    if (data) setExplorationHistory(data);
  }, [user]);

  const refreshProfile = useCallback(async () => {
    if (!user) return;
    const { data } = await getProfile(user.id);
    if (data) setProfile(data);
  }, [user]);


  const selectCity = useCallback((cityData) => {
    setSelectedCity(cityData);
    setSidePanel({ open: true, tab: 'weather' });
    if (cityData?.coordinates) {
      setMapCenter({
        lng: cityData.coordinates.lon,
        lat: cityData.coordinates.lat
      });
      setMapZoom(10);
    }
  }, []);

  const closeSidePanel = useCallback(() => {
    setSidePanel({ open: false, tab: 'weather' });
  }, []);

  const value = {
    // Auth
    user,
    profile,
    loading,
    // Data
    savedLocations,
    explorationHistory,
    selectedCity,
    sidePanel,
    // Map
    mapCenter,
    mapZoom,
    setMapCenter,
    setMapZoom,
    // Actions
    selectCity,
    closeSidePanel,
    setSidePanel,
    refreshLocations,
    refreshHistory,
    refreshProfile,
    loadUserData,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp debe usarse dentro de AppProvider');
  }
  return context;
};
