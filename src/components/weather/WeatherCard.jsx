import { Droplets, Wind, Eye, Thermometer, Sunrise, Sunset, Gauge } from 'lucide-react';
import { getWeatherEmoji, getWindDirection, capitalize } from '../../utils/helpers';
import Loader from '../ui/Loader';

export default function WeatherCard({ data, loading }) {
  if (loading) return <Loader text="Cargando clima..." />;

  if (!data) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-3">☁️</div>
        <p className="text-dark-400 text-sm">No se pudo obtener el clima</p>
        <p className="text-dark-500 text-xs mt-1">Intenta con otra ubicación</p>
      </div>
    );
  }

  const sunriseTime = new Date(data.sunrise).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
  const sunsetTime = new Date(data.sunset).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="space-y-4">
      {/* Main weather */}
      <div className="text-center py-4">
        <div className="text-6xl mb-2">{getWeatherEmoji(data.icon)}</div>
        <div className="text-5xl font-display font-bold text-white mb-1">
          {data.temperature}°C
        </div>
        <div className="text-dark-400 text-sm capitalize">
          {data.description}
        </div>
        <div className="text-dark-500 text-xs mt-1">
          Sensación: {data.feels_like}°C
        </div>
      </div>

      {/* Min/Max */}
      <div className="flex justify-center gap-6">
        <div className="text-center">
          <div className="text-sm text-blue-400 font-medium">↓ {data.temp_min}°</div>
          <div className="text-xs text-dark-500">Mínima</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-red-400 font-medium">↑ {data.temp_max}°</div>
          <div className="text-xs text-dark-500">Máxima</div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-3">
        <DetailItem
          icon={Droplets}
          label="Humedad"
          value={`${data.humidity}%`}
          color="text-blue-400"
        />
        <DetailItem
          icon={Wind}
          label="Viento"
          value={`${data.wind_speed} m/s ${getWindDirection(data.wind_deg)}`}
          color="text-cyan-400"
        />
        <DetailItem
          icon={Gauge}
          label="Presión"
          value={`${data.pressure} hPa`}
          color="text-purple-400"
        />
        <DetailItem
          icon={Eye}
          label="Visibilidad"
          value={`${(data.visibility / 1000).toFixed(1)} km`}
          color="text-green-400"
        />
        <DetailItem
          icon={Sunrise}
          label="Amanecer"
          value={sunriseTime}
          color="text-amber-400"
        />
        <DetailItem
          icon={Sunset}
          label="Atardecer"
          value={sunsetTime}
          color="text-orange-400"
        />
      </div>

      {/* Weather icon from API */}
      {data.icon_url && (
        <div className="text-center pt-2">
          <img
            src={data.icon_url}
            alt={data.description}
            className="w-20 h-20 mx-auto opacity-60"
          />
          <p className="text-xs text-dark-600">OpenWeatherMap API</p>
        </div>
      )}
    </div>
  );
}

function DetailItem({ icon: Icon, label, value, color }) {
  return (
    <div className="p-3 bg-dark-900/40 rounded-xl">
      <div className="flex items-center gap-2 mb-1">
        <Icon className={`w-4 h-4 ${color}`} />
        <span className="text-xs text-dark-500">{label}</span>
      </div>
      <div className="text-sm font-medium text-dark-200">{value}</div>
    </div>
  );
}
