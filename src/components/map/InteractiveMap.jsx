import { useState, useCallback, useRef } from 'react';
import Map, { NavigationControl, GeolocateControl, Marker } from 'react-map-gl';
import { useApp } from '../../context/AppContext';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || '';

export default function InteractiveMap({ onMapClick }) {
  const { mapCenter, mapZoom, selectedCity } = useApp();
  const mapRef = useRef(null);

  const [viewState, setViewState] = useState({
    longitude: mapCenter.lng,
    latitude: mapCenter.lat,
    zoom: mapZoom,
    pitch: 0,
    bearing: 0,
  });

  const handleClick = useCallback((event) => {
    const { lngLat } = event;
    if (onMapClick) {
      onMapClick(lngLat);
    }
  }, [onMapClick]);

  // Si no hay token de Mapbox, mostrar placeholder
  if (!MAPBOX_TOKEN) {
    return (
      <div className="w-full h-full bg-dark-900 flex items-center justify-center">
        <div className="text-center p-8 glass-card max-w-md">
          <div className="text-5xl mb-4">🗺️</div>
          <h3 className="text-xl font-display font-bold text-white mb-2">
            Mapa No Disponible
          </h3>
          <p className="text-dark-400 text-sm mb-4">
            Configura tu token de Mapbox en el archivo <code className="text-primary-400">.env</code>
          </p>
          <code className="block text-xs text-dark-500 bg-dark-900 p-3 rounded-lg text-left">
            VITE_MAPBOX_TOKEN=tu_token_aquí
          </code>
        </div>
      </div>
    );
  }

  return (
    <Map
      ref={mapRef}
      {...viewState}
      onMove={evt => setViewState(evt.viewState)}
      onClick={handleClick}
      mapboxAccessToken={MAPBOX_TOKEN}
      mapStyle="mapbox://styles/mapbox/dark-v11"
      style={{ width: '100%', height: '100%' }}
      attributionControl={false}
      cursor="crosshair"
      maxZoom={18}
      minZoom={1.5}
    >
      {/* Controles */}
      <NavigationControl position="bottom-right" showCompass={true} />
      <GeolocateControl
        position="bottom-right"
        trackUserLocation={true}
        showAccuracyCircle={false}
      />

      {/* Marker de la ciudad seleccionada */}
      {selectedCity?.coordinates && (
        <Marker
          longitude={selectedCity.coordinates.lon}
          latitude={selectedCity.coordinates.lat}
          anchor="bottom"
        >
          <div className="relative">
            <div className="map-marker-pulse" />
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-dark-900/90 text-white text-xs px-3 py-1.5 rounded-lg border border-primary-500/30 shadow-lg">
              {selectedCity.city}
            </div>
          </div>
        </Marker>
      )}
    </Map>
  );
}
