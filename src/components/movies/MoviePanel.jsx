import { Star, Calendar, ExternalLink, Film } from 'lucide-react';
import Loader from '../ui/Loader';

export default function MoviePanel({ data, loading, city }) {
  if (loading) return <Loader text="Buscando películas..." />;

  if (!data || !data.movies || data.movies.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-3">🎬</div>
        <p className="text-dark-400 text-sm">
          No se encontraron películas para "{city}"
        </p>
        <p className="text-dark-500 text-xs mt-1">
          Intenta con otra ciudad o nombre
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Film className="w-4 h-4 text-dark-400" />
          <span className="text-sm text-dark-400">
            {data.total_results} resultados para "{city}"
          </span>
        </div>
      </div>

      {/* Movie list */}
      <div className="space-y-3">
        {data.movies.map((movie) => (
          <div
            key={movie.id}
            className="flex gap-3 p-3 bg-dark-900/40 rounded-xl hover:bg-dark-800/50 transition-all group"
          >
            {/* Poster */}
            <div className="w-16 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-dark-800">
              {movie.poster_url ? (
                <img
                  src={movie.poster_url}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl">
                  🎬
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-white truncate group-hover:text-primary-400 transition-colors">
                {movie.title}
              </h4>
              
              {movie.original_title !== movie.title && (
                <p className="text-xs text-dark-500 truncate italic">
                  {movie.original_title}
                </p>
              )}

              {/* Rating & Year */}
              <div className="flex items-center gap-3 mt-1.5">
                {movie.vote_average > 0 && (
                  <span className="flex items-center gap-1 text-xs">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="text-amber-300">{movie.vote_average.toFixed(1)}</span>
                  </span>
                )}
                {movie.release_date && (
                  <span className="flex items-center gap-1 text-xs text-dark-500">
                    <Calendar className="w-3 h-3" />
                    {new Date(movie.release_date).getFullYear()}
                  </span>
                )}
              </div>

              {/* Overview */}
              {movie.overview && (
                <p className="text-xs text-dark-400 mt-1.5 line-clamp-2 leading-relaxed">
                  {movie.overview}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-dark-600 text-center pt-2">
        Datos de TMDB API • Las películas pueden no estar directamente relacionadas con la ciudad
      </p>
    </div>
  );
}
