import { useState } from 'react';
import { X, MapPin, Bookmark, Loader2 } from 'lucide-react';
import { saveLocation } from '../../services/supabaseClient';
import { useApp } from '../../context/AppContext';
import { locationCategories } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function SaveLocationModal({ city, weatherData, onClose }) {
  const { user, refreshLocations, refreshProfile } = useApp();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: city.city || '',
    notes: '',
    category: 'general',
  });

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Debes iniciar sesión');
      return;
    }

    setLoading(true);
    try {
      const { error } = await saveLocation({
        user_id: user.id,
        name: form.name,
        city: city.city,
        country: city.country,
        country_code: city.country_code || '',
        latitude: city.coordinates.lat,
        longitude: city.coordinates.lon,
        notes: form.notes,
        category: form.category,
        weather_snapshot: weatherData || {},
      });

      if (error) throw error;
      toast.success('¡Ubicación guardada!');
      refreshLocations();
      refreshProfile();
      onClose();
    } catch (error) {
      toast.error(error.message || 'Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md glass-card p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-primary-400" />
            <h3 className="text-lg font-display font-bold text-white">Guardar Ubicación</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-dark-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-dark-400" />
          </button>
        </div>

        {/* City preview */}
        <div className="flex items-center gap-3 p-3 bg-dark-900/50 rounded-xl mb-5">
          <MapPin className="w-5 h-5 text-primary-400 flex-shrink-0" />
          <div>
            <div className="text-sm font-medium text-white">{city.city}</div>
            <div className="text-xs text-dark-400">{city.country}</div>
          </div>
          {weatherData && (
            <div className="ml-auto text-right">
              <div className="text-sm font-medium text-white">{weatherData.temperature}°C</div>
              <div className="text-xs text-dark-400 capitalize">{weatherData.description}</div>
            </div>
          )}
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm text-dark-400 mb-1.5">Nombre</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input-glass"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-dark-400 mb-1.5">Categoría</label>
            <div className="grid grid-cols-3 gap-2">
              {locationCategories.map(cat => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setForm({ ...form, category: cat.value })}
                  className={`p-2 rounded-xl text-center text-xs font-medium transition-all ${
                    form.category === cat.value
                      ? 'bg-primary-500/20 border border-primary-500/30 text-primary-300'
                      : 'bg-dark-900/50 border border-dark-700 text-dark-400 hover:border-dark-600'
                  }`}
                >
                  <span className="text-lg block mb-0.5">{cat.emoji}</span>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm text-dark-400 mb-1.5">Notas (opcional)</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="input-glass resize-none h-20"
              placeholder="Escribe una nota sobre este lugar..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Bookmark className="w-4 h-4" />
                Guardar Ubicación
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
