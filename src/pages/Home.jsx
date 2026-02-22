import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, Cloud, Github, Film, Database, ArrowRight, 
  Globe, Zap, Shield, Sparkles 
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
  })
};

const apis = [
  {
    icon: MapPin,
    name: 'Mapbox GL',
    description: 'Mapas interactivos con geocodificación en tiempo real',
    color: 'from-blue-500 to-cyan-500',
    tag: 'Geolocalización'
  },
  {
    icon: Cloud,
    name: 'OpenWeather',
    description: 'Datos meteorológicos en tiempo real para cualquier ciudad',
    color: 'from-amber-500 to-orange-500',
    tag: 'Clima'
  },
  {
    icon: Github,
    name: 'GitHub API',
    description: 'Comunidades de desarrolladores por ubicación geográfica',
    color: 'from-gray-400 to-gray-600',
    tag: 'Red Social'
  },
  {
    icon: Film,
    name: 'TMDB API',
    description: 'Películas y contenido multimedia relacionado con ciudades',
    color: 'from-green-500 to-emerald-500',
    tag: 'Streaming'
  },
  {
    icon: Database,
    name: 'Supabase',
    description: 'Base de datos PostgreSQL con autenticación y RLS',
    color: 'from-primary-500 to-purple-500',
    tag: 'Base de Datos'
  }
];

const features = [
  {
    icon: Globe,
    title: 'Explora el Mundo',
    description: 'Navega un mapa interactivo y descubre ciudades con un clic'
  },
  {
    icon: Zap,
    title: 'Datos en Tiempo Real',
    description: 'Clima, desarrolladores y películas actualizados al instante'
  },
  {
    icon: Shield,
    title: 'Guarda tus Favoritos',
    description: 'Crea tu colección personal de ubicaciones y reseñas'
  },
  {
    icon: Sparkles,
    title: '5 APIs Integradas',
    description: 'Arquitectura orientada a servicios con múltiples fuentes'
  }
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden">
      {/* Background Orbs */}
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />
      <div className="bg-orb bg-orb-3" />

      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0}
            className="mb-6"
          >
            <span className="badge-primary text-sm px-4 py-1.5">
              🌍 Plataforma de Exploración Urbana
            </span>
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
            className="text-5xl md:text-7xl lg:text-8xl font-display font-bold mb-6 leading-tight"
          >
            Descubre el Mundo,{' '}
            <span className="gradient-text">Una Ciudad</span>
            <br />
            a la Vez
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={2}
            className="text-lg md:text-xl text-dark-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Explora clima en tiempo real, comunidades de desarrolladores, 
            películas icónicas y mucho más. Todo desde un mapa interactivo 
            impulsado por 5 APIs externas.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={3}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={() => navigate('/explorer')}
              className="btn-primary text-lg flex items-center justify-center gap-2 group"
            >
              Comenzar a Explorar
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate('/about')}
              className="btn-secondary text-lg"
            >
              Ver Documentación
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={4}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
          >
            {[
              { value: '5', label: 'APIs Integradas' },
              { value: '195+', label: 'Países' },
              { value: '∞', label: 'Ciudades' },
              { value: '24/7', label: 'Datos en Vivo' }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-display font-bold gradient-text-static">
                  {stat.value}
                </div>
                <div className="text-sm text-dark-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-dark-600 rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-primary-400 rounded-full mt-2"
            />
          </div>
        </motion.div>
      </section>

      {/* APIs */}
      <section className="relative py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
              Impulsado por <span className="gradient-text">5 APIs</span>
            </h2>
            <p className="text-dark-400 text-lg max-w-2xl mx-auto">
              Arquitectura orientada a servicios que integra múltiples fuentes de datos 
              en una experiencia unificada
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apis.map((api, i) => (
              <motion.div
                key={api.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="glass-card p-6 group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${api.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <api.icon className="w-6 h-6 text-white" />
                </div>
                <span className="badge-primary text-xs mb-3">{api.tag}</span>
                <h3 className="text-xl font-semibold text-white mb-2">{api.name}</h3>
                <p className="text-dark-400 text-sm leading-relaxed">{api.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
              ¿Qué Puedes Hacer?
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="flex gap-5 p-6 glass-card"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-7 h-7 text-primary-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">{feature.title}</h3>
                  <p className="text-dark-400 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mt-16"
          >
            <button
              onClick={() => navigate('/explorer')}
              className="btn-primary text-lg px-10 py-4 flex items-center gap-3 mx-auto group"
            >
              <Globe className="w-5 h-5" />
              Explorar Ahora
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
