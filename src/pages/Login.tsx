import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Shield, AlertCircle, Mail, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendingVerification, setResendingVerification] = useState(false);
  const [showResendOption, setShowResendOption] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login, resendVerification } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      setShowResendOption(false);
      
      await login(email, password);
      
      toast.success('¡Inicio de sesión exitoso!');
      navigate('/');
    } catch (err: any) {
      console.error('Error en login:', err);
      if (err.message.includes('verify your email') || err.message.includes('verifica tu correo')) {
        setError('Debes verificar tu dirección de email antes de iniciar sesión. Revisa tu bandeja de entrada.');
        setShowResendOption(true);
      } else if (err.code === 'auth/user-not-found') {
        setError('No se encontró una cuenta con esta dirección de email.');
      } else if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Contraseña incorrecta. Intenta de nuevo.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Dirección de email inválida.');
      } else if (err.code === 'auth/user-disabled') {
        setError('Esta cuenta ha sido deshabilitada. Contacta soporte.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Demasiados intentos fallidos. Intenta de nuevo más tarde.');
      } else {
        setError('Error al iniciar sesión. Verifica tus credenciales.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!email) {
      toast.error('Por favor ingresa tu dirección de email primero.');
      return;
    }

    try {
      setResendingVerification(true);
      
      // Intentar reenviar la verificación directamente
      // Primero necesitamos verificar si el usuario existe y no está verificado
      try {
        // Intentar hacer login para obtener el usuario actual
        await login(email, password);
      } catch (loginError: any) {
        // Si el login falla por verificación de email, continuamos
        if (loginError.message.includes('verify your email') || 
            loginError.message.includes('verifica tu correo')) {
          // El usuario existe pero no está verificado, podemos reenviar
        } else {
          // Otro tipo de error de login
          throw loginError;
        }
      }

      // Intentar reenviar la verificación
      try {
        await resendVerification();
        toast.success('Email de verificación enviado. Revisa tu bandeja de entrada.');
      } catch (resendError: any) {
        console.error('Error reenviando verificación:', resendError);
        
        if (resendError.message.includes('already verified')) {
          toast.success('Tu email ya está verificado. Intenta iniciar sesión de nuevo.');
        } else if (resendError.message === 'too-many-requests') {
          toast.error('Demasiadas solicitudes. Intenta de nuevo en unos minutos.');
        } else if (resendError.message === 'No user logged in or email already verified') {
          toast.error('No hay usuario conectado o el email ya está verificado.');
        } else {
          toast.error('Error al enviar el email de verificación. Intenta de nuevo.');
        }
      }
    } catch (error: any) {
      console.error('Error en handleResendVerification:', error);
      
      if (error.code === 'auth/user-not-found') {
        toast.error('No se encontró una cuenta con esta dirección de email.');
      } else if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        toast.error('Contraseña incorrecta. Verifica tus credenciales.');
      } else if (error.code === 'auth/invalid-email') {
        toast.error('Dirección de email inválida.');
      } else if (error.code === 'auth/user-disabled') {
        toast.error('Esta cuenta ha sido deshabilitada. Contacta soporte.');
      } else if (error.code === 'auth/too-many-requests') {
        toast.error('Demasiados intentos fallidos. Intenta de nuevo más tarde.');
      } else {
        toast.error('Error al procesar la solicitud. Verifica tus credenciales.');
      }
    } finally {
      setResendingVerification(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8 pt-28">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Bienvenido de vuelta</h2>
          <p className="text-gray-600">
            ¿No tienes una cuenta?{' '}
            <Link 
              to="/signup" 
              className="font-semibold text-blue-600 hover:text-blue-500 transition-colors duration-200"
            >
              Crea una ahora
            </Link>
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
          {/* Error Display */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-red-700 leading-relaxed">{error}</p>
                  {showResendOption && (
                    <button
                      onClick={handleResendVerification}
                      disabled={resendingVerification}
                      className="mt-3 inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-500 transition-colors duration-200 disabled:opacity-50 font-medium"
                    >
                      {resendingVerification ? (
                        <>
                          <RefreshCw className="animate-spin" size={14} />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Mail size={14} />
                          Reenviar email de verificación
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección de Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="Ingresa tu email"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="Ingresa tu contraseña"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember_me"
                  name="remember_me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors duration-200"
                />
                <label htmlFor="remember_me" className="ml-3 block text-sm text-gray-700">
                  Recordarme
                </label>
              </div>

              <Link
                to="/forgot-password"
                className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-3 py-3 px-4 border border-transparent rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] font-medium shadow-lg"
            >
              <LogIn className="h-5 w-5" />
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </form>

          {/* Email Verification Info */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-start">
              <Mail className="h-5 w-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-700">
                <p className="font-medium mb-1">Verificación de Email Requerida</p>
                <p className="leading-relaxed">
                  Debes verificar tu dirección de email antes de poder iniciar sesión. 
                  Revisa tu bandeja de entrada para el enlace de verificación.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-gray-500">
          Al iniciar sesión, aceptas nuestros{' '}
          <Link to="/terms" className="text-blue-600 hover:text-blue-500 transition-colors duration-200">
            Términos de Servicio
          </Link>{' '}
          y{' '}
          <Link to="/privacy" className="text-blue-600 hover:text-blue-500 transition-colors duration-200">
            Política de Privacidad
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;