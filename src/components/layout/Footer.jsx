import { Github, Globe, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-dark-800/50 bg-dark-950/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-dark-500 text-sm">
            <span className="text-lg">🌍</span>
            <span className="font-display font-semibold text-dark-400">CityPulse</span>
            <span>© {new Date().getFullYear()}</span>
          </div>

          <div className="flex items-center gap-1 text-dark-500 text-sm">
            <span>Hecho con</span>
            <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" />
            <span>usando React + 5 APIs</span>
          </div>

          <div className="flex items-center gap-4 text-dark-500 text-xs">
            <span className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" /> Mapbox
            </span>
            <span>OpenWeather</span>
            <span className="flex items-center gap-1">
              <Github className="w-3.5 h-3.5" /> GitHub
            </span>
            <span>TMDB</span>
            <span>Supabase</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
