import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, Star, Clock, Heart, Trash2, Globe, 
  MessageSquare, BarChart3, LogIn 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { deleteLocation, toggleFavorite, getUserReviews, deleteReview } from '../services/supabaseClient';
import { formatDate, timeAgo, getFlagEmoji, getStarDisplay, capitalize } from '../utils/helpers';
import Loader from '../components/ui/Loader';
import toast from 'react-hot-toast';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.05, duration: 0.4 }
  })
};

export default function Dashboard() {
  const { user, profile, savedLocations, explorationHistory, refreshLocations, refreshProfile } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('locations');
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  useEffect(() => {
    if (user && activeTab === 'reviews') {
      loadReviews();
    }
  }, [user, activeTab]);

  const loadReviews = async () => {
    setLoadingReviews(true);
    const { data } = await getUserReviews(user.id);
    if (data) setReviews(data);
    setLoadingReviews(false);
  };

  const handleDeleteLocation = async (id) => {
    const { error } = await deleteLocation(id);
    if (!error) {
      toast.success('Ubicación eliminada');
      refreshLocations();
      refreshProfile();
    } else {
      toast.error('Error al eliminar');
    }
  };

  const handleToggleFavorite = async (id, current) => {
    const { error } = await toggleFavorite(id, !current);
    if (!error) {
      refreshLocations();
      toast.success(current ? 'Removido de favoritos' : 'Agregado a favoritos');
    }
  };

  const handleDeleteReview = async (id) => {
    const { error } = await deleteReview(id);
    if (!error) {
      toast.success('Reseña eliminada');
      loadReviews();
    }
  };

  // Si no hay usuario logueado
  if (!user) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-10 text-center max-w-md"
        >
          <LogIn className="w-16 h-16 text-primary-400 mx-auto mb-4" />
          <h2 className="text-2xl font-display font-bold text-white mb-2">
            Inicia Sesión
          </h2>
          <p className="text-dark-400 mb-6">
            Necesitas una cuenta para acceder a tu dashboard personal
          </p>
          <button
            onClick={() => navigate('/auth')}
            className="btn-primary"
          >
            Ir a Iniciar Sesión
          </button>
        </motion.div>
      </div>
    );
  }

  const stats = [
    { icon: MapPin, label: 'Guardadas', value: savedLocations.length, color: 'text-primary-400' },
    { icon: Globe, label: 'Exploradas', value: explorationHistory.length, color: 'text-cyan-400' },
    { icon: Star, label: 'Favoritas', value: savedLocations.filter(l => l.is_favorite).length, color: 'text-amber-400' },
    { icon: MessageSquare, label: 'Reseñas', value: reviews.length, color: 'text-green-400' },
  ];

  const tabs = [
    { id: 'locations', label: 'Ubicaciones', icon: MapPin },
    { id: 'history', label: 'Historial', icon: Clock },
    { id: 'reviews', label: 'Reseñas', icon: Star },
  ];

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-2">
            <img
              src={profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`}
              alt="Avatar"
              className="w-16 h-16 rounded-2xl border-2 border-primary-500/30"
            />
            <div>
              <h1 className="text-3xl font-display font-bold text-white">
                ¡Hola, {profile?.display_name || 'Explorador'}! 👋
              </h1>
              <p className="text-dark-400">@{profile?.username}</p>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={1}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {stats.map((stat, i) => (
            <div key={i} className="glass-card p-5 text-center">
              <stat.icon className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
              <div className="text-2xl font-display font-bold text-white">{stat.value}</div>
              <div className="text-xs text-dark-400">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 bg-dark-900/50 rounded-xl p-1 mb-6 max-w-md">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-dark-800 text-white'
                  : 'text-dark-400 hover:text-dark-200'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'locations' && (
          <div>
            {savedLocations.length === 0 ? (
              <EmptyState
                icon={MapPin}
                title="No hay ubicaciones guardadas"
                description="Explora el mapa y guarda tus lugares favoritos"
                action={() => navigate('/explorer')}
                actionLabel="Ir al Explorador"
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedLocations.map((loc, i) => (
                  <motion.div
                    key={loc.id}
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                    custom={i}
                    className="glass-card p-5"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-white truncate">{loc.name}</h3>
                        <p className="text-sm text-dark-400">
                          {getFlagEmoji(loc.country_code)} {loc.city}, {loc.country}
                        </p>
                      </div>
                      <span className="text-xs bg-primary-500/10 text-primary-300 px-2 py-0.5 rounded-full ml-2">
                        {capitalize(loc.category)}
                      </span>
                    </div>
                    {loc.notes && (
                      <p className="text-sm text-dark-300 mb-3 line-clamp-2">{loc.notes}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-dark-500">{timeAgo(loc.created_at)}</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleToggleFavorite(loc.id, loc.is_favorite)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            loc.is_favorite ? 'text-red-400 bg-red-400/10' : 'text-dark-500 hover:text-red-400'
                          }`}
                        >
                          <Heart className="w-4 h-4" fill={loc.is_favorite ? 'currentColor' : 'none'} />
                        </button>
                        <button
                          onClick={() => handleDeleteLocation(loc.id)}
                          className="p-1.5 rounded-lg text-dark-500 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div>
            {explorationHistory.length === 0 ? (
              <EmptyState
                icon={Clock}
                title="Sin historial aún"
                description="Cada ciudad que explores se registrará aquí"
                action={() => navigate('/explorer')}
                actionLabel="Comenzar a Explorar"
              />
            ) : (
              <div className="space-y-3">
                {explorationHistory.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                    custom={i}
                    className="glass-card p-4 flex items-center gap-4"
                  >
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0">
                      <Globe className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium text-white truncate">{item.city}</h4>
                      <p className="text-xs text-dark-400">{item.country}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-xs text-dark-400">{timeAgo(item.explored_at)}</div>
                      <div className="text-xs text-dark-500">
                        {item.latitude?.toFixed(2)}°, {item.longitude?.toFixed(2)}°
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div>
            {loadingReviews ? (
              <Loader text="Cargando reseñas..." />
            ) : reviews.length === 0 ? (
              <EmptyState
                icon={Star}
                title="Sin reseñas aún"
                description="Comparte tu experiencia sobre las ciudades que visites"
              />
            ) : (
              <div className="space-y-4">
                {reviews.map((review, i) => (
                  <motion.div
                    key={review.id}
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                    custom={i}
                    className="glass-card p-5"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-white">{review.title}</h4>
                        <p className="text-sm text-dark-400">{review.city}, {review.country}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteReview(review.id)}
                        className="p-1.5 rounded-lg text-dark-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-amber-400 text-sm mb-2">
                      {getStarDisplay(review.rating)}
                    </div>
                    <p className="text-sm text-dark-300">{review.review_text}</p>
                    <div className="flex items-center gap-2 mt-3">
                      {review.tags?.map(tag => (
                        <span key={tag} className="badge-primary text-xs">{tag}</span>
                      ))}
                    </div>
                    <div className="text-xs text-dark-500 mt-2">{formatDate(review.created_at)}</div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState({ icon: Icon, title, description, action, actionLabel }) {
  return (
    <div className="text-center py-16">
      <Icon className="w-12 h-12 text-dark-600 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-dark-300 mb-1">{title}</h3>
      <p className="text-sm text-dark-500 mb-4">{description}</p>
      {action && (
        <button onClick={action} className="btn-primary text-sm">
          {actionLabel}
        </button>
      )}
    </div>
  );
}
