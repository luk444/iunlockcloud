import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Lock, CheckCircle, AlertCircle, RefreshCw, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { confirmPasswordReset, checkActionCode } = useAuth();
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [validCode, setValidCode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  // Firebase puede enviar el código con diferentes nombres de parámetros
  const oobCode = searchParams.get('oobCode') || 
                  searchParams.get('oobcode') || 
                  searchParams.get('code') ||
                  searchParams.get('actionCode') ||
                  searchParams.get('action_code');

  useEffect(() => {
    const verifyCode = async () => {
      if (!oobCode) {
        console.log('No se encontró código de restablecimiento en los parámetros:', location.search);
        setVerifying(false);
        return;
      }

      try {
        console.log('Verificando código de restablecimiento:', oobCode);
        const actionCodeInfo = await checkActionCode(oobCode);
        console.log('Información del código de acción:', actionCodeInfo);
        
        if (actionCodeInfo.operation === 'PASSWORD_RESET') {
          setValidCode(true);
          setEmail(actionCodeInfo.data?.email || '');
        } else {
          setValidCode(false);
        }
      } catch (error: any) {
        console.error('Error verifying reset code:', error);
        setValidCode(false);
      } finally {
        setVerifying(false);
      }
    };

    verifyCode();
  }, [oobCode, checkActionCode, location.search]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!oobCode) {
      toast.error('Código de restablecimiento no válido');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      setLoading(true);
      await confirmPasswordReset(oobCode, password);
      setResetSuccess(true);
      toast.success('¡Contraseña restablecida exitosamente!');
      
      // Redirigir después de 3 segundos
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error: any) {
      console.error('Error resetting password:', error);
      
      if (error.code === 'auth/invalid-action-code') {
        toast.error('El código de restablecimiento es inválido o ha expirado');
      } else if (error.code === 'auth/weak-password') {
        toast.error('La contraseña es demasiado débil');
      } else {
        toast.error(`Error al restablecer la contraseña: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Mostrar información de debug en desarrollo
  const isDevelopment = process.env.NODE_ENV === 'development';

  if (verifying) {
    return (
      <div className="bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-sm p-6 text-center">
          <div className="flex justify-center mb-6">
            <RefreshCw className="animate-spin text-blue-500" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Verificando Código</h1>
          <p className="text-gray-600">Por favor espera mientras verificamos tu código...</p>
          
          {isDevelopment && oobCode && (
            <div className="mt-4 p-3 bg-gray-100 rounded text-xs text-gray-600">
              <p><strong>Debug:</strong> Código encontrado: {oobCode.substring(0, 20)}...</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!validCode) {
    return (
      <div className="bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-sm p-6 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="text-red-500" size={32} />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Código Inválido</h1>
          <p className="text-gray-600 mb-6">
            El código de restablecimiento es inválido o ha expirado. Solicita un nuevo enlace.
          </p>
          
          {isDevelopment && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-xs text-red-700">
              <p><strong>Debug Info:</strong></p>
              <p>URL: {location.pathname + location.search}</p>
              <p>Parámetros: {location.search}</p>
              <p>Código encontrado: {oobCode ? 'Sí' : 'No'}</p>
            </div>
          )}
          
          <button
            onClick={() => navigate('/forgot-password')}
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Solicitar Nuevo Enlace
          </button>
        </div>
      </div>
    );
  }

  if (resetSuccess) {
    return (
      <div className="bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-sm p-6 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="text-green-500" size={32} />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">¡Contraseña Restablecida!</h1>
          <p className="text-gray-600 mb-6">
            Tu contraseña ha sido restablecida exitosamente. Serás redirigido al login en unos segundos.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Ir al Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8 ">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
              <Lock className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Nueva Contraseña</h2>
          <p className="text-gray-600">
            Ingresa tu nueva contraseña para la cuenta <strong>{email}</strong>
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Nueva Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="Ingresa tu nueva contraseña"
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

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar Contraseña
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="Confirma tu nueva contraseña"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-3 py-3 px-4 border border-transparent rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] font-medium shadow-lg"
            >
              {loading ? (
                <>
                  <RefreshCw className="animate-spin h-5 w-5" />
                  Restableciendo...
                </>
              ) : (
                <>
                  <Lock className="h-5 w-5" />
                  Restablecer Contraseña
                </>
              )}
            </button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <h3 className="font-medium text-blue-800 mb-2">💡 Requisitos de Contraseña:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Mínimo 6 caracteres</li>
              <li>• Usa una combinación de letras y números</li>
              <li>• Evita usar información personal</li>
              {isDevelopment && (
                <li>• En desarrollo, revisa la consola para más información de debug</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword; 