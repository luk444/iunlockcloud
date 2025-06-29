import React, { useState, useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, RefreshCw, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const PrivateRoute: React.FC = () => {
  const { currentUser, loading, resendVerification, refreshUser } = useAuth();
  const [resendingVerification, setResendingVerification] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const [checkingVerification, setCheckingVerification] = useState(false);
  const navigate = useNavigate();

  // Verificar periódicamente si el email fue verificado
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (currentUser && !currentUser.emailVerified) {
      intervalId = setInterval(async () => {
        try {
          await refreshUser();
        } catch (error) {
          console.error('Error checking email verification:', error);
        }
      }, 5000); // Verificar cada 5 segundos
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [currentUser?.emailVerified, refreshUser]);

  const handleResendVerification = async () => {
    if (cooldown) {
      toast.error('Debes esperar antes de reenviar el correo.');
      return;
    }

    try {
      setResendingVerification(true);
      setCooldown(true);

      // Verificar primero si el email ya está verificado
      await refreshUser();

      if (currentUser?.emailVerified) {
        toast.success('¡Tu correo ya está verificado! Redirigiendo...');
        return;
      }

      await resendVerification();
      toast.success('Correo de verificación enviado. Revisa tu bandeja de entrada.');

      // Cooldown de 60 segundos
      setTimeout(() => setCooldown(false), 60000);
    } catch (err: any) {
      console.error(err);

      if (err.message === 'too-many-requests' || err.code === 'auth/too-many-requests') {
        toast.error('Demasiadas solicitudes. Intenta de nuevo en unos minutos.');
      } else if (err.message === 'No user logged in or email already verified') {
        toast.success('Tu correo ya está verificado. Redirigiendo...');
        navigate('/');
      } else {
        toast.error('No se pudo enviar el correo. Intenta de nuevo.');
      }
    } finally {
      setResendingVerification(false);
    }
  };

  const handleCheckVerification = async () => {
    try {
      setCheckingVerification(true);
      await refreshUser();
      
      if (currentUser?.emailVerified) {
        toast.success('Email verified successfully!');
      } else {
        toast.error('Email not yet verified. Check your inbox.');
      }
    } catch (error) {
      console.error('Error checking verification:', error);
      toast.error('Error checking email status.');
    } finally {
      setCheckingVerification(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (!currentUser.emailVerified) {
    return (
      <div className="min-h-screen bg-gray-50 pt-28 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-sm p-6 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
              <Mail className="text-yellow-500" size={32} />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-800 mb-4">Email Verification Required</h1>

          <p className="text-gray-600 mb-6">
            You must verify your email to access this feature. Check your inbox (including spam) for the verification link.
          </p>

          <div className="space-y-3">
            <button
              onClick={handleCheckVerification}
              disabled={checkingVerification}
              className="w-full py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {checkingVerification ? (
                <>
                  <RefreshCw className="animate-spin" size={16} />
                  Verifying...
                </>
              ) : (
                <>
                  <CheckCircle size={16} />
                  I already verified my email
                </>
              )}
            </button>

            <button
              onClick={handleResendVerification}
              disabled={resendingVerification || cooldown}
              className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {resendingVerification ? (
                <>
                  <RefreshCw className="animate-spin" size={16} />
                  Sending...
                </>
              ) : cooldown ? (
                <>
                  <Mail size={16} />
                  Please wait before forwarding
                </>
              ) : (
                <>
                  <Mail size={16} />
                  Resend verification email
                </>
              )}
            </button>

            <button
              onClick={() => navigate('/login')}
              className="w-full py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Return to login
            </button>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-left">
            <h3 className="font-medium text-blue-800 mb-2">💡 Tips:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Check your spam folder</li>
              <li>• The email may take a few minutes</li>
              <li>• Click "I've already verified my email" after verifying</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return <Outlet />;
};

export default PrivateRoute;