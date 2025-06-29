import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, ArrowLeft, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { sendPasswordReset } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Por favor ingresa tu dirección de email');
      return;
    }

    try {
      setLoading(true);
      await sendPasswordReset(email);
      setEmailSent(true);
      toast.success('Email de restablecimiento enviado. Revisa tu bandeja de entrada.');
    } catch (error: any) {
      console.error('Error sending password reset:', error);
      
      if (error.code === 'auth/user-not-found') {
        toast.error('No se encontró una cuenta con esta dirección de email');
      } else if (error.code === 'auth/invalid-email') {
        toast.error('Dirección de email inválida');
      } else if (error.code === 'auth/too-many-requests') {
        toast.error('Demasiadas solicitudes. Intenta de nuevo en unos minutos');
      } else {
        toast.error('Error al enviar el email. Intenta de nuevo');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[90vh] flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
              <Mail className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Restablecer Contraseña</h2>
          <p className="text-gray-600">
            Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
          {!emailSent ? (
            <form onSubmit={handleSubmit} className="space-y-6">
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

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-3 py-3 px-4 border border-transparent rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] font-medium shadow-lg"
              >
                {loading ? (
                  <>
                    <RefreshCw className="animate-spin h-5 w-5" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Mail className="h-5 w-5" />
                    Enviar Email de Restablecimiento
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Mail className="text-green-500" size={32} />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">¡Email Enviado!</h3>
                <p className="text-gray-600">
                  Hemos enviado un enlace de restablecimiento a <strong>{email}</strong>
                </p>
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => setEmailSent(false)}
                  className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Enviar Otro Email
                </button>
                <Link
                  to="/login"
                  className="w-full block py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-center"
                >
                  Volver al Login
                </Link>
              </div>
            </div>
          )}

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <h3 className="font-medium text-blue-800 mb-2">💡 Consejos:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Revisa tu carpeta de spam si no encuentras el email</li>
              <li>• El enlace expira después de 1 hora</li>
              <li>• Asegúrate de usar la misma dirección de email de tu cuenta</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft size={16} />
            Volver al Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword; 