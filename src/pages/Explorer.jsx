import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, X, Cloud, Github, Film, Bookmark, 
  ChevronRight, MapPin, Loader2 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import InteractiveMap from '../components/map/InteractiveMap';
import WeatherCard from '../components/weather/WeatherCard';
import GitHubPanel from '../components/github/GitHubPanel';
import MoviePanel from '../components/movies/MoviePanel';
import SaveLocationModal from '../components/locations/SaveLocationModal';
import { weatherAPI, githubAPI, moviesAPI, geocodeAPI } from '../services/api';
import { addExploration } from '../services/supabaseClient';
import { debounce } from '../utils/helpers';
import toast from 'react-hot-toast';

const tabs = [
  { id: 'weather', label: 'Clima', icon: Cloud, color: 'text-amber-400' },
  { id: 'github', label: 'GitHub', icon: Github, color: 'text-gray-300' },
  { id: 'movies', label: 'Películas', icon: Film, color: 'text-green-400' },
];

export default function Explorer() {
  const { user, selectedCity, selectCity, sidePanel, setSidePanel, closeSidePanel, refreshHistory } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const [weatherData, setWeatherData] = useState(null);
  const [githubData, setGithubData] = useState(null);
  const [moviesData, setMoviesData] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [loadingGithub, setLoadingGithub] = useState(false);
  const [loadingMovies, setLoadingMovies] = useState(false);

  const [showSaveModal, setShowSaveModal] = useState(false);

  // Buscar ciudades
  const searchCities = useCallback(
    debounce(async (query) => {
      if (!query || query.length < 2) {
        setSearchResults([]);
        setShowSearchResults(false);
        return;
      }
      setSearchLoading(true);
      try {
        const data = await geocodeAPI.search(query);
        setSearchResults(data.results || []);
        setShowSearchResults(true);
      } catch {
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 400),
    []
  );

  useEffect(() => {
    searchCities(searchQuery);
  }, [searchQuery, searchCities]);

  // Seleccionar resultado de busqueda
  const handleSelectSearchResult = (result) => {
    selectCity({
      city: result.name,
      country: result.country,
      country_code: result.country_code,
      full_name: result.full_name,
      coordinates: result.coordinates
    });
    setSearchQuery(result.full_name);
    setShowSearchResults(false);
    loadCityData(result.name, result.coordinates);
  };

  // Click en el mapa
  const handleMapClick = async (lngLat) => {
    try {
      const geoData = await geocodeAPI.reverse(lngLat.lat, lngLat.lng);
      selectCity({
        city: geoData.city,
        country: geoData.country,
        country_code: geoData.country_code,
        full_name: geoData.full_name,
        coordinates: geoData.coordinates
      });
      setSearchQuery(geoData.full_name);
      loadCityData(geoData.city, geoData.coordinates);
    } catch {
      toast.error('Error al obtener información de ubicación');
    }
  };

  // Cargar datos de la ciudad
  const loadCityData = async (cityName, coordinates) => {
    // Weather
    setLoadingWeather(true);
    setWeatherData(null);
    try {
      const data = await weatherAPI.getByCoords(coordinates.lat, coordinates.lon);
      setWeatherData(data);
    } catch {
      setWeatherData(null);
    } finally {
      setLoadingWeather(false);
    }

    // GitHub
    setLoadingGithub(true);
    setGithubData(null);
    try {
      const data = await githubAPI.searchUsers(cityName);
      setGithubData(data);
    } catch {
      setGithubData(null);
    } finally {
      setLoadingGithub(false);
    }

    // Movies
    setLoadingMovies(true);
    setMoviesData(null);
    try {
      const data = await moviesAPI.searchByCity(cityName);
      setMoviesData(data);
    } catch {
      setMoviesData(null);
    } finally {
      setLoadingMovies(false);
    }

    // Registrar exploración
    if (user) {
      try {
        await addExploration({
          user_id: user.id,
          city: cityName,
          country: '',
          latitude: coordinates.lat,
          longitude: coordinates.lon,
        });
        refreshHistory();
      } catch {
        // Silenciar error de log
      }
    }
  };

  const activeTab = sidePanel.tab;

  return (
    <div className="h-[calc(100vh-64px)] flex relative overflow-hidden">
      {/* Mapa */}
      <div className="flex-1 relative">
        <InteractiveMap onMapClick={handleMapClick} />

        {/* Search Bar flotante */}
        <div className="absolute top-4 left-4 right-4 md:left-6 md:right-auto md:w-96 z-10">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchResults.length > 0 && setShowSearchResults(true)}
              placeholder="Buscar ciudad..."
              className="w-full pl-12 pr-10 py-3.5 bg-dark-900/90 backdrop-blur-xl border border-dark-700 rounded-2xl text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all shadow-glass"
            />
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(''); setShowSearchResults(false); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-dark-700 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-dark-400" />
              </button>
            )}

            {/* Resultados de búsqueda */}
            <AnimatePresence>
              {showSearchResults && searchResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-dark-900/95 backdrop-blur-xl border border-dark-700 rounded-2xl overflow-hidden shadow-glass z-50"
                >
                  {searchResults.map((result, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelectSearchResult(result)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-dark-800/50 transition-colors text-left"
                    >
                      <MapPin className="w-4 h-4 text-primary-400 flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="text-sm text-white truncate">{result.name}</div>
                        <div className="text-xs text-dark-400 truncate">{result.full_name}</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-dark-600 ml-auto flex-shrink-0" />
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {searchLoading && (
              <div className="absolute right-12 top-1/2 -translate-y-1/2">
                <Loader2 className="w-4 h-4 text-primary-400 animate-spin" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Side Panel */}
      <AnimatePresence>
        {sidePanel.open && selectedCity && (
          <motion.div
            initial={{ x: 420 }}
            animate={{ x: 0 }}
            exit={{ x: 420 }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="w-full md:w-[400px] h-full bg-dark-950/95 backdrop-blur-xl border-l border-dark-800 overflow-hidden flex flex-col absolute md:relative right-0 top-0 z-20"
          >
            {/* Header */}
            <div className="p-5 border-b border-dark-800">
              <div className="flex items-start justify-between mb-3">
                <div className="min-w-0 flex-1">
                  <h2 className="text-xl font-display font-bold text-white truncate">
                    {selectedCity.city}
                  </h2>
                  <p className="text-sm text-dark-400">{selectedCity.country}</p>
                </div>
                <div className="flex items-center gap-2 ml-2">
                  {user && (
                    <button
                      onClick={() => setShowSaveModal(true)}
                      className="p-2 hover:bg-dark-800 rounded-lg transition-colors"
                      title="Guardar ubicación"
                    >
                      <Bookmark className="w-5 h-5 text-primary-400" />
                    </button>
                  )}
                  <button
                    onClick={closeSidePanel}
                    className="p-2 hover:bg-dark-800 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-dark-400" />
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 bg-dark-900/50 rounded-xl p-1">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setSidePanel({ ...sidePanel, tab: tab.id })}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                      activeTab === tab.id
                        ? 'bg-dark-800 text-white shadow-sm'
                        : 'text-dark-400 hover:text-dark-200'
                    }`}
                  >
                    <tab.icon className={`w-3.5 h-3.5 ${activeTab === tab.id ? tab.color : ''}`} />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5">
              <AnimatePresence mode="wait">
                {activeTab === 'weather' && (
                  <motion.div
                    key="weather"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <WeatherCard data={weatherData} loading={loadingWeather} />
                  </motion.div>
                )}
                {activeTab === 'github' && (
                  <motion.div
                    key="github"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <GitHubPanel data={githubData} loading={loadingGithub} city={selectedCity.city} />
                  </motion.div>
                )}
                {activeTab === 'movies' && (
                  <motion.div
                    key="movies"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <MoviePanel data={moviesData} loading={loadingMovies} city={selectedCity.city} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Save Location Modal */}
      {showSaveModal && selectedCity && (
        <SaveLocationModal
          city={selectedCity}
          weatherData={weatherData}
          onClose={() => setShowSaveModal(false)}
        />
      )}
    </div>
  );
}
