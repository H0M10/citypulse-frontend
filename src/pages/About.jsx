import { motion } from 'framer-motion';
import { 
  Globe, Cloud, Github, Film, Database, Server, 
  Code2, FileJson, ArrowRight, ExternalLink 
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5 }
  })
};

const techStack = [
  { category: 'Frontend', items: ['React 18', 'Vite', 'Tailwind CSS', 'Framer Motion', 'React Router', 'Mapbox GL JS'] },
  { category: 'Backend', items: ['Node.js', 'Express', 'Axios', 'CORS', 'Helmet', 'Rate Limiting'] },
  { category: 'Base de Datos', items: ['Supabase', 'PostgreSQL', 'Row Level Security', 'Triggers'] },
  { category: 'APIs Externas', items: ['Mapbox', 'OpenWeatherMap', 'GitHub REST API', 'TMDB API'] },
  { category: 'Deploy', items: ['GitHub Pages', 'Railway', 'Supabase Cloud'] },
];

const apiDetails = [
  {
    icon: Globe,
    name: 'Mapbox GL JS',
    type: 'API de Geolocalización',
    description: 'Mapa interactivo con renderizado WebGL. Soporte para geocodificación directa e inversa, markers personalizados y navegación fluida.',
    endpoints: ['Geocoding API', 'Maps GL JS', 'Static Images API'],
    dataFormat: 'GeoJSON',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Cloud,
    name: 'OpenWeatherMap',
    type: 'API de Plataforma Online',
    description: 'Datos meteorológicos en tiempo real incluyendo temperatura, humedad, presión, viento y pronóstico extendido a 5 días.',
    endpoints: ['Current Weather', 'Forecast 5 days', 'Geocoding'],
    dataFormat: 'JSON',
    color: 'from-amber-500 to-orange-500'
  },
  {
    icon: Github,
    name: 'GitHub REST API',
    type: 'API de Red Social / Contenido',
    description: 'Búsqueda de desarrolladores y repositorios por ubicación geográfica. Perfiles detallados con estadísticas y actividad.',
    endpoints: ['Search Users', 'Search Repos', 'User Profile'],
    dataFormat: 'JSON',
    color: 'from-gray-400 to-gray-600'
  },
  {
    icon: Film,
    name: 'TMDB API',
    type: 'API de Streaming / Contenido',
    description: 'Base de datos de películas y series. Búsqueda por título/ciudad, pósters, calificaciones, trailers y elenco.',
    endpoints: ['Search Movies', 'Popular', 'Movie Details'],
    dataFormat: 'JSON',
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: Database,
    name: 'Supabase',
    type: 'Base de Datos',
    description: 'PostgreSQL como servicio con autenticación, Row Level Security, triggers automáticos y API REST auto-generada.',
    endpoints: ['Auth', 'Database', 'Realtime', 'Storage'],
    dataFormat: 'JSON / SQL',
    color: 'from-primary-500 to-purple-500'
  }
];

const architecture = [
  { label: 'Usuario', icon: '👤' },
  { label: 'React Frontend', icon: '⚛️' },
  { label: 'Express Backend', icon: '🔧' },
  { label: 'APIs Externas', icon: '🌐' },
  { label: 'Supabase DB', icon: '🗃️' },
];

export default function About() {
  return (
    <div className="min-h-screen py-12 px-4 relative">
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-3" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-center mb-16"
        >
          <span className="badge-primary text-sm px-4 py-1.5 mb-4 inline-block">
            📄 Documentación Técnica
          </span>
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">
            Sobre <span className="gradient-text">CityPulse</span>
          </h1>
          <p className="text-dark-400 text-lg max-w-2xl mx-auto">
            Plataforma de exploración urbana que integra 5 APIs externas
            en una arquitectura orientada a servicios
          </p>
        </motion.div>

        {/* Problema y Objetivo */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="glass-card p-8 mb-8"
        >
          <h2 className="text-2xl font-display font-bold text-white mb-4 flex items-center gap-3">
            <Code2 className="w-6 h-6 text-primary-400" />
            Descripción del Problema
          </h2>
          <p className="text-dark-300 leading-relaxed mb-4">
            Los viajeros y exploradores urbanos necesitan acceder a múltiples fuentes de información 
            (clima, comunidades tech, entretenimiento local) de forma fragmentada. No existe una 
            plataforma unificada que combine datos geográficos, meteorológicos, de comunidades de 
            desarrollo y de entretenimiento en una sola experiencia.
          </p>
          <h3 className="text-lg font-semibold text-white mb-2">Objetivo</h3>
          <p className="text-dark-300 leading-relaxed">
            Desarrollar una aplicación web orientada a servicios que integre al menos 5 APIs externas, 
            permitiendo a los usuarios explorar ciudades del mundo con información en tiempo real, 
            gestionar ubicaciones favoritas y compartir reseñas.
          </p>
        </motion.section>

        {/* Arquitectura */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="glass-card p-8 mb-8"
        >
          <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-3">
            <Server className="w-6 h-6 text-primary-400" />
            Arquitectura del Sistema
          </h2>
          
          {/* Flow Diagram */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8 py-4">
            {architecture.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="glass-card p-4 text-center min-w-[120px]">
                  <div className="text-2xl mb-1">{item.icon}</div>
                  <div className="text-xs text-dark-300 font-medium">{item.label}</div>
                </div>
                {i < architecture.length - 1 && (
                  <ArrowRight className="w-5 h-5 text-primary-500 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-dark-900/50 rounded-xl">
              <h4 className="font-semibold text-white mb-2">🖥️ Frontend (GitHub Pages)</h4>
              <ul className="text-sm text-dark-400 space-y-1">
                <li>• React 18 con Vite como bundler</li>
                <li>• HashRouter para compatibilidad con GitHub Pages</li>
                <li>• Tailwind CSS + Framer Motion para UI</li>
                <li>• Conexión directa a Supabase (Auth + DB)</li>
              </ul>
            </div>
            <div className="p-4 bg-dark-900/50 rounded-xl">
              <h4 className="font-semibold text-white mb-2">⚙️ Backend (Railway)</h4>
              <ul className="text-sm text-dark-400 space-y-1">
                <li>• Express.js como proxy de APIs</li>
                <li>• Oculta API keys del cliente</li>
                <li>• Rate limiting y seguridad con Helmet</li>
                <li>• CORS configurado para el dominio del frontend</li>
              </ul>
            </div>
          </div>
        </motion.section>

        {/* APIs Detalle */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mb-8"
        >
          <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-3">
            <FileJson className="w-6 h-6 text-primary-400" />
            APIs Integradas
          </h2>

          <div className="space-y-4">
            {apiDetails.map((api, i) => (
              <motion.div
                key={api.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="glass-card p-6"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${api.color} flex items-center justify-center flex-shrink-0`}>
                    <api.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-white">{api.name}</h3>
                      <span className="badge-primary text-xs">{api.type}</span>
                    </div>
                    <p className="text-sm text-dark-400 mb-3">{api.description}</p>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {api.endpoints.map(ep => (
                        <span key={ep} className="text-xs px-2 py-0.5 bg-dark-800 text-dark-300 rounded-md">
                          {ep}
                        </span>
                      ))}
                    </div>
                    <div className="text-xs text-dark-500">
                      Formato de datos: <span className="text-primary-400">{api.dataFormat}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Tech Stack */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="glass-card p-8 mb-8"
        >
          <h2 className="text-2xl font-display font-bold text-white mb-6">
            🛠️ Stack Tecnológico
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {techStack.map((group, i) => (
              <div key={i} className="p-4 bg-dark-900/50 rounded-xl">
                <h4 className="font-semibold text-primary-400 text-sm mb-3">{group.category}</h4>
                <div className="flex flex-wrap gap-1.5">
                  {group.items.map(item => (
                    <span key={item} className="text-xs px-2 py-1 bg-dark-800 text-dark-300 rounded-md">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Flujo de datos */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="glass-card p-8 mb-8"
        >
          <h2 className="text-2xl font-display font-bold text-white mb-4">
            🔄 Flujo de Datos
          </h2>
          <div className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <span className="w-7 h-7 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
              <p className="text-dark-300">
                <strong className="text-white">Interacción del usuario</strong>: El usuario busca una ciudad o hace clic en el mapa interactivo (Mapbox GL JS).
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-7 h-7 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
              <p className="text-dark-300">
                <strong className="text-white">Geocodificación</strong>: El backend consulta la API de Mapbox para obtener el nombre de la ciudad a partir de las coordenadas (reverse geocoding).
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-7 h-7 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
              <p className="text-dark-300">
                <strong className="text-white">Consultas paralelas</strong>: Se lanzan 3 peticiones simultáneas al backend: clima (OpenWeather), desarrolladores (GitHub), películas (TMDB).
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-7 h-7 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">4</span>
              <p className="text-dark-300">
                <strong className="text-white">Transformación</strong>: El backend procesa, normaliza y filtra las respuestas JSON de cada API.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-7 h-7 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">5</span>
              <p className="text-dark-300">
                <strong className="text-white">Presentación</strong>: El frontend renderiza los datos en componentes React con animaciones (Framer Motion).
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-7 h-7 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">6</span>
              <p className="text-dark-300">
                <strong className="text-white">Persistencia</strong>: Si el usuario está autenticado, la exploración se registra en Supabase (PostgreSQL) con RLS.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Equipo */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-center py-8"
        >
          <p className="text-dark-500 text-sm">
            Evaluación Unidad II — Implementación de APIs de terceros en aplicaciones web orientadas a servicios
          </p>
          <p className="text-dark-600 text-xs mt-2">
            CityPulse © {new Date().getFullYear()} — Todos los derechos reservados
          </p>
        </motion.section>
      </div>
    </div>
  );
}
