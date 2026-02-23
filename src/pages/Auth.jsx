import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, Lock, User, Eye, EyeOff, ArrowRight, ArrowLeft,
  Loader2, CheckCircle2, AlertCircle, MailCheck, RefreshCw, KeyRound, ShieldCheck
} from 'lucide-react';
import { signIn, signUp, resetPassword, updatePassword, resendConfirmationEmail } from '../services/supabaseClient';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';

const VIEW = {
  LOGIN: 'login',
  REGISTER: 'register',
  CHECK_EMAIL: 'check_email',
  FORGOT_PASSWORD: 'forgot_password',
  RESET_SENT: 'reset_sent',
  NEW_PASSWORD: 'new_password',
};

function getSupabaseErrorMessage(error) {
  const msg = error?.message?.toLowerCase() || '';
  if (msg.includes('invalid login credentials'))
    return 'Correo o contraseña incorrectos. Verifica tus datos e intenta de nuevo.';
  if (msg.includes('email not confirmed'))
    return 'Tu correo aún no está verificado. Revisa tu bandeja de entrada (y spam) para activar tu cuenta.';
  if (msg.includes('user already registered') || msg.includes('already been registered'))
    return 'Este correo ya está registrado. ¿Quieres iniciar sesión en vez de crear una cuenta?';
  if (msg.includes('signup is not allowed') || msg.includes('signups not allowed'))
    return 'El registro no está disponible en este momento.';
  if (msg.includes('password') && msg.includes('at least'))
    return 'La contraseña debe tener al menos 6 caracteres.';
  if (msg.includes('rate limit') || msg.includes('too many requests'))
    return 'Demasiados intentos. Espera unos minutos antes de intentar de nuevo.';
  if (msg.includes('network') || msg.includes('fetch'))
    return 'Error de conexión. Verifica tu internet e intenta de nuevo.';
  return error?.message || 'Ocurrió un error inesperado. Intenta de nuevo.';
}

function PasswordStrength({ password }) {
  const checks = [
    { label: 'Mínimo 6 caracteres', ok: password.length >= 6 },
    { label: 'Contiene una mayúscula', ok: /[A-Z]/.test(password) },
    { label: 'Contiene un número', ok: /[0-9]/.test(password) },
  ];
  const passed = checks.filter(c => c.ok).length;
  const barColor = passed <= 1 ? 'bg-red-500' : passed === 2 ? 'bg-yellow-500' : 'bg-green-500';
  const strengthLabel = passed <= 1 ? 'Débil' : passed === 2 ? 'Media' : 'Fuerte';

  if (!password) return null;

  return (
    <div className="mt-2 space-y-2">
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-dark-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${barColor}`}
            style={{ width: `${(passed / checks.length) * 100}%` }}
          />
        </div>
        <span className={`text-xs font-medium ${passed <= 1 ? 'text-red-400' : passed === 2 ? 'text-yellow-400' : 'text-green-400'}`}>
          {strengthLabel}
        </span>
      </div>
      <div className="space-y-1">
        {checks.map((check, i) => (
          <div key={i} className="flex items-center gap-1.5">
            {check.ok ? (
              <CheckCircle2 className="w-3 h-3 text-green-400" />
            ) : (
              <AlertCircle className="w-3 h-3 text-dark-500" />
            )}
            <span className={`text-xs ${check.ok ? 'text-green-400' : 'text-dark-500'}`}>
              {check.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useApp();
  const [view, setView] = useState(VIEW.LOGIN);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
  });

  useEffect(() => {
    if (user) {
      navigate('/explorer');
    }
  }, [user, navigate]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('mode') === 'reset') {
      setView(VIEW.NEW_PASSWORD);
    }
  }, [location]);

  const resetForm = () => {
    setForm({ email: '', password: '', confirmPassword: '', username: '' });
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const switchView = (newView) => {
    resetForm();
    setView(newView);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await signIn(form.email, form.password);
      if (error) {
        if (error.message?.toLowerCase().includes('email not confirmed')) {
          setRegisteredEmail(form.email);
          toast.error('Tu correo no está verificado. Revisa tu bandeja de entrada.');
          setView(VIEW.CHECK_EMAIL);
          setLoading(false);
          return;
        }
        throw error;
      }
      toast.success('¡Bienvenido de vuelta!');
      navigate('/explorer');
    } catch (error) {
      toast.error(getSupabaseErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!form.username.trim()) {
      toast.error('El nombre de usuario es obligatorio');
      return;
    }
    if (form.password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await signUp(form.email, form.password, form.username);
      if (error) throw error;
      setRegisteredEmail(form.email);
      setView(VIEW.CHECK_EMAIL);
    } catch (error) {
      toast.error(getSupabaseErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await resetPassword(form.email);
      if (error) throw error;
      setRegisteredEmail(form.email);
      setView(VIEW.RESET_SENT);
    } catch (error) {
      toast.error(getSupabaseErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleNewPassword = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }
    setLoading(true);
    try {
      const { error } = await updatePassword(form.password);
      if (error) throw error;
      toast.success('¡Contraseña actualizada correctamente!');
      navigate('/explorer');
    } catch (error) {
      toast.error(getSupabaseErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (!registeredEmail) return;
    setResending(true);
    try {
      const { error } = await resendConfirmationEmail(registeredEmail);
      if (error) throw error;
      toast.success('¡Correo reenviado! Revisa tu bandeja de entrada.');
    } catch (error) {
      toast.error('No se pudo reenviar el correo. Intenta en unos minutos.');
    } finally {
      setTimeout(() => setResending(false), 30000);
    }
  };

  const pageVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35 } },
    exit: { opacity: 0, y: -20, scale: 0.98, transition: { duration: 0.2 } },
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 relative">
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />

      <div className="w-full max-w-md">
        <AnimatePresence mode="wait">

          {/* ===================== LOGIN ===================== */}
          {view === VIEW.LOGIN && (
            <motion.div key="login" variants={pageVariants} initial="hidden" animate="visible" exit="exit">
              <div className="glass-card p-8">
                <div className="text-center mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center mx-auto mb-4">
                    <User className="w-7 h-7 text-primary-400" />
                  </div>
                  <h1 className="text-3xl font-display font-bold text-white mb-2">
                    Bienvenido
                  </h1>
                  <p className="text-dark-400">
                    Inicia sesión para continuar explorando
                  </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="correo@ejemplo.com"
                      className="input-glass pl-12"
                      required
                      autoComplete="email"
                    />
                  </div>

                  <div>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        placeholder="Contraseña"
                        className="input-glass pl-12 pr-12"
                        required
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    <div className="flex justify-end mt-2">
                      <button
                        type="button"
                        onClick={() => switchView(VIEW.FORGOT_PASSWORD)}
                        className="text-xs text-dark-400 hover:text-primary-400 transition-colors"
                      >
                        ¿Olvidaste tu contraseña?
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full flex items-center justify-center gap-2 py-3.5"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        Iniciar Sesión
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>

                <div className="text-center mt-6">
                  <button
                    onClick={() => switchView(VIEW.REGISTER)}
                    className="text-sm text-dark-400 hover:text-primary-400 transition-colors"
                  >
                    ¿No tienes cuenta? <span className="text-primary-400 font-medium">Regístrate</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ===================== REGISTER ===================== */}
          {view === VIEW.REGISTER && (
            <motion.div key="register" variants={pageVariants} initial="hidden" animate="visible" exit="exit">
              <div className="glass-card p-8">
                <div className="text-center mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-4">
                    <User className="w-7 h-7 text-green-400" />
                  </div>
                  <h1 className="text-3xl font-display font-bold text-white mb-2">
                    Crear Cuenta
                  </h1>
                  <p className="text-dark-400">
                    Únete a la comunidad de exploradores
                  </p>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                    <input
                      type="text"
                      value={form.username}
                      onChange={(e) => setForm({ ...form, username: e.target.value })}
                      placeholder="Nombre de usuario"
                      className="input-glass pl-12"
                      required
                      autoComplete="username"
                    />
                  </div>

                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="correo@ejemplo.com"
                      className="input-glass pl-12"
                      required
                      autoComplete="email"
                    />
                  </div>

                  <div>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        placeholder="Contraseña"
                        className="input-glass pl-12 pr-12"
                        required
                        minLength={6}
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    <PasswordStrength password={form.password} />
                  </div>

                  <div className="relative">
                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={form.confirmPassword}
                      onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                      placeholder="Confirmar contraseña"
                      className={`input-glass pl-12 pr-12 ${
                        form.confirmPassword && form.password !== form.confirmPassword
                          ? 'border-red-500/50 focus:border-red-500'
                          : form.confirmPassword && form.password === form.confirmPassword
                          ? 'border-green-500/50 focus:border-green-500'
                          : ''
                      }`}
                      required
                      minLength={6}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {form.confirmPassword && form.password !== form.confirmPassword && (
                    <p className="text-xs text-red-400 flex items-center gap-1 -mt-2">
                      <AlertCircle className="w-3 h-3" />
                      Las contraseñas no coinciden
                    </p>
                  )}

                  <div className="bg-dark-800/50 rounded-xl p-3 border border-dark-700/50">
                    <p className="text-xs text-dark-400 flex items-start gap-2">
                      <Mail className="w-4 h-4 mt-0.5 text-primary-400 shrink-0" />
                      <span>
                        Después de registrarte, te enviaremos un <strong className="text-dark-300">correo de verificación</strong>.
                        Debes hacer clic en el enlace del correo para activar tu cuenta antes de poder iniciar sesión.
                      </span>
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || (form.confirmPassword && form.password !== form.confirmPassword)}
                    className="btn-primary w-full flex items-center justify-center gap-2 py-3.5"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        Crear Cuenta
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>

                <div className="text-center mt-6">
                  <button
                    onClick={() => switchView(VIEW.LOGIN)}
                    className="text-sm text-dark-400 hover:text-primary-400 transition-colors"
                  >
                    ¿Ya tienes cuenta? <span className="text-primary-400 font-medium">Inicia sesión</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ===================== CHECK EMAIL (post-register) ===================== */}
          {view === VIEW.CHECK_EMAIL && (
            <motion.div key="check-email" variants={pageVariants} initial="hidden" animate="visible" exit="exit">
              <div className="glass-card p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
                  className="w-20 h-20 rounded-full bg-green-500/10 border-2 border-green-500/30 flex items-center justify-center mx-auto mb-6"
                >
                  <MailCheck className="w-10 h-10 text-green-400" />
                </motion.div>

                <h1 className="text-2xl font-display font-bold text-white mb-3">
                  ¡Revisa tu correo!
                </h1>

                <div className="space-y-3 mb-6">
                  <p className="text-dark-300">
                    Te enviamos un correo de verificación a:
                  </p>
                  <div className="bg-dark-800/70 rounded-xl px-4 py-3 border border-dark-700/50 inline-block">
                    <span className="text-primary-400 font-medium text-sm">
                      {registeredEmail}
                    </span>
                  </div>
                </div>

                <div className="bg-dark-800/50 rounded-xl p-4 border border-dark-700/50 text-left space-y-3 mb-6">
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    Pasos para activar tu cuenta:
                  </h3>
                  <ol className="text-sm text-dark-400 space-y-2 list-decimal list-inside">
                    <li>Abre tu correo electrónico (<strong className="text-dark-300">Gmail, Outlook, etc.</strong>)</li>
                    <li>Busca un correo de <strong className="text-dark-300">CityPulse</strong> o <strong className="text-dark-300">Supabase</strong></li>
                    <li>Si no lo ves, revisa la carpeta de <strong className="text-yellow-400">Spam / Correo no deseado</strong></li>
                    <li>Haz clic en el <strong className="text-dark-300">enlace de verificación</strong> del correo</li>
                    <li>Regresa aquí e <strong className="text-dark-300">inicia sesión</strong> con tu correo y contraseña</li>
                  </ol>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => switchView(VIEW.LOGIN)}
                    className="btn-primary w-full flex items-center justify-center gap-2 py-3.5"
                  >
                    <ArrowRight className="w-5 h-5" />
                    Ya verifiqué, ir a Iniciar Sesión
                  </button>

                  <button
                    onClick={handleResendEmail}
                    disabled={resending}
                    className="btn-ghost w-full flex items-center justify-center gap-2 py-3 text-sm"
                  >
                    {resending ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                        Correo reenviado (espera 30s)
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4" />
                        ¿No recibiste el correo? Reenviar
                      </>
                    )}
                  </button>
                </div>

                <div className="mt-4 pt-4 border-t border-dark-800">
                  <button
                    onClick={() => switchView(VIEW.REGISTER)}
                    className="text-xs text-dark-500 hover:text-dark-300 transition-colors"
                  >
                    ¿Usaste otro correo? Volver a registrarse
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ===================== FORGOT PASSWORD ===================== */}
          {view === VIEW.FORGOT_PASSWORD && (
            <motion.div key="forgot" variants={pageVariants} initial="hidden" animate="visible" exit="exit">
              <div className="glass-card p-8">
                <div className="text-center mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center mx-auto mb-4">
                    <KeyRound className="w-7 h-7 text-yellow-400" />
                  </div>
                  <h1 className="text-2xl font-display font-bold text-white mb-2">
                    Recuperar Contraseña
                  </h1>
                  <p className="text-dark-400 text-sm">
                    Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña
                  </p>
                </div>

                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="correo@ejemplo.com"
                      className="input-glass pl-12"
                      required
                      autoComplete="email"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full flex items-center justify-center gap-2 py-3.5"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        Enviar Enlace
                        <Mail className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>

                <div className="text-center mt-6">
                  <button
                    onClick={() => switchView(VIEW.LOGIN)}
                    className="text-sm text-dark-400 hover:text-primary-400 transition-colors flex items-center gap-1 justify-center"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Volver a Iniciar Sesión
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ===================== RESET SENT ===================== */}
          {view === VIEW.RESET_SENT && (
            <motion.div key="reset-sent" variants={pageVariants} initial="hidden" animate="visible" exit="exit">
              <div className="glass-card p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
                  className="w-20 h-20 rounded-full bg-yellow-500/10 border-2 border-yellow-500/30 flex items-center justify-center mx-auto mb-6"
                >
                  <Mail className="w-10 h-10 text-yellow-400" />
                </motion.div>

                <h1 className="text-2xl font-display font-bold text-white mb-3">
                  Correo Enviado
                </h1>

                <div className="space-y-3 mb-6">
                  <p className="text-dark-300">
                    Enviamos un enlace para restablecer tu contraseña a:
                  </p>
                  <div className="bg-dark-800/70 rounded-xl px-4 py-3 border border-dark-700/50 inline-block">
                    <span className="text-primary-400 font-medium text-sm">
                      {registeredEmail}
                    </span>
                  </div>
                </div>

                <div className="bg-dark-800/50 rounded-xl p-4 border border-dark-700/50 text-left space-y-2 mb-6">
                  <p className="text-sm text-dark-400">
                    Abre el correo y haz clic en el enlace para crear una nueva contraseña.
                    Si no lo ves, revisa la carpeta de <strong className="text-yellow-400">Spam</strong>.
                  </p>
                </div>

                <button
                  onClick={() => switchView(VIEW.LOGIN)}
                  className="btn-primary w-full flex items-center justify-center gap-2 py-3.5"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Volver a Iniciar Sesión
                </button>
              </div>
            </motion.div>
          )}

          {/* ===================== NEW PASSWORD (from reset link) ===================== */}
          {view === VIEW.NEW_PASSWORD && (
            <motion.div key="new-pass" variants={pageVariants} initial="hidden" animate="visible" exit="exit">
              <div className="glass-card p-8">
                <div className="text-center mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center mx-auto mb-4">
                    <KeyRound className="w-7 h-7 text-primary-400" />
                  </div>
                  <h1 className="text-2xl font-display font-bold text-white mb-2">
                    Nueva Contraseña
                  </h1>
                  <p className="text-dark-400 text-sm">
                    Escribe tu nueva contraseña para actualizar tu cuenta
                  </p>
                </div>

                <form onSubmit={handleNewPassword} className="space-y-4">
                  <div>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        placeholder="Nueva contraseña"
                        className="input-glass pl-12 pr-12"
                        required
                        minLength={6}
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    <PasswordStrength password={form.password} />
                  </div>

                  <div className="relative">
                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={form.confirmPassword}
                      onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                      placeholder="Confirmar nueva contraseña"
                      className={`input-glass pl-12 pr-12 ${
                        form.confirmPassword && form.password !== form.confirmPassword
                          ? 'border-red-500/50 focus:border-red-500'
                          : form.confirmPassword && form.password === form.confirmPassword
                          ? 'border-green-500/50 focus:border-green-500'
                          : ''
                      }`}
                      required
                      minLength={6}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {form.confirmPassword && form.password !== form.confirmPassword && (
                    <p className="text-xs text-red-400 flex items-center gap-1 -mt-2">
                      <AlertCircle className="w-3 h-3" />
                      Las contraseñas no coinciden
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading || (form.confirmPassword && form.password !== form.confirmPassword)}
                    className="btn-primary w-full flex items-center justify-center gap-2 py-3.5"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        Actualizar Contraseña
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
