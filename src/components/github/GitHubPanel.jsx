import { ExternalLink, Users, GitFork, Star, MapPin } from 'lucide-react';
import { formatNumber } from '../../utils/helpers';
import Loader from '../ui/Loader';

export default function GitHubPanel({ data, loading, city }) {
  if (loading) return <Loader text="Buscando desarrolladores..." />;

  if (!data || !data.users || data.users.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-3">💻</div>
        <p className="text-dark-400 text-sm">
          No se encontraron desarrolladores en {city}
        </p>
        <p className="text-dark-500 text-xs mt-1">
          Intenta con una ciudad más grande
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Stats header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-dark-400" />
          <span className="text-sm text-dark-400">
            {formatNumber(data.total_count)} desarrolladores en
          </span>
        </div>
        <span className="badge-primary text-xs flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {city}
        </span>
      </div>

      {/* User list */}
      <div className="space-y-3">
        {data.users.map((user) => (
          <a
            key={user.id}
            href={user.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 bg-dark-900/40 rounded-xl hover:bg-dark-800/50 transition-all group"
          >
            <div className="flex items-start gap-3">
              <img
                src={user.avatar_url}
                alt={user.login}
                className="w-10 h-10 rounded-full border border-dark-700 group-hover:border-primary-500/30 transition-colors"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-white truncate">
                    {user.name || user.login}
                  </h4>
                  <ExternalLink className="w-3 h-3 text-dark-600 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                </div>
                <p className="text-xs text-dark-500 truncate">@{user.login}</p>
                {user.bio && (
                  <p className="text-xs text-dark-400 mt-1 line-clamp-2">{user.bio}</p>
                )}

                {/* Stats */}
                <div className="flex items-center gap-3 mt-2">
                  <span className="flex items-center gap-1 text-xs text-dark-500">
                    <Users className="w-3 h-3" />
                    {formatNumber(user.followers)}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-dark-500">
                    <GitFork className="w-3 h-3" />
                    {user.public_repos} repos
                  </span>
                  {user.location && (
                    <span className="flex items-center gap-1 text-xs text-dark-500">
                      <MapPin className="w-3 h-3" />
                      {user.location}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>

      <p className="text-xs text-dark-600 text-center pt-2">
        Datos de GitHub REST API v3
      </p>
    </div>
  );
}
