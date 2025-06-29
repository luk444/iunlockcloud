import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, CheckCircle, AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const EmailVerification: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyEmail, checkActionCode } = useAuth();
  const [loading, setLoading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [errorMessage, setErrorMessage] = useState('');

  // Firebase puede enviar el código con diferentes nombres de parámetros
  const oobCode = searchParams.get('oobCode') || 
                  searchParams.get('oobcode') || 
                  searchParams.get('code') ||
                  searchParams.get('actionCode') ||
                  searchParams.get('action_code');

  useEffect(() => {
    const handleVerification = async () => {
      if (!oobCode) {
        console.log('No se encontró código de verificación en los parámetros:', location.search);
        setVerificationStatus('error');
        setErrorMessage('Código de verificación no válido');
        return;
      }

      setLoading(true);
      try {
        console.log('Intentando verificar código:', oobCode);
        
        // Verificar el código antes de aplicarlo
        const actionCodeInfo = await checkActionCode(oobCode);
        console.log('Información del código de acción:', actionCodeInfo);
        
        if (actionCodeInfo.operation === 'VERIFY_EMAIL') {
          await verifyEmail(oobCode);
          setVerificationStatus('success');
          toast.success('¡Email verificado exitosamente!');
          
          // Redirigir después de 3 segundos
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        } else {
          setVerificationStatus('error');
          setErrorMessage(`Código de verificación inválido. Operación: ${actionCodeInfo.operation}`);
        }
      } catch (error: any) {
        console.error('Error verifying email:', error);
        setVerificationStatus('error');
        
        if (error.code === 'auth/invalid-action-code') {
          setErrorMessage('El código de verificación es inválido o ha expirado');
        } else if (error.code === 'auth/user-disabled') {
          setErrorMessage('La cuenta ha sido deshabilitada');
        } else {
          setErrorMessage(`Error al verificar el email: ${error.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    if (oobCode) {
      handleVerification();
    }
  }, [oobCode, verifyEmail, checkActionCode, navigate, location.search]);

  // Mostrar información de debug en desarrollo
  const isDevelopment = process.env.NODE_ENV === 'development';

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-28 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-sm p-6 text-center">
          <div className="flex justify-center mb-6">
            <RefreshCw className="animate-spin text-blue-500" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Verificando Email</h1>
          <p className="text-gray-600">Por favor espera mientras verificamos tu email...</p>
          
          {isDevelopment && oobCode && (
            <div className="mt-4 p-3 bg-gray-100 rounded text-xs text-gray-600">
              <p><strong>Debug:</strong> Código encontrado: {oobCode.substring(0, 20)}...</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-28 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-sm p-6 text-center">
        {verificationStatus === 'success' ? (
          <>
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="text-green-500" size={32} />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">¡Email Verificado!</h1>
            <p className="text-gray-600 mb-6">
              Tu dirección de email ha sido verificada exitosamente. Serás redirigido al login en unos segundos.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Ir al Login
            </button>
          </>
        ) : verificationStatus === 'error' ? (
          <>
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="text-red-500" size={32} />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Error de Verificación</h1>
            <p className="text-gray-600 mb-6">{errorMessage}</p>
            
            {isDevelopment && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                <p><strong>Debug Info:</strong></p>
                <p>URL: {location.pathname + location.search}</p>
                <p>Parámetros: {location.search}</p>
                <p>Código encontrado: {oobCode ? 'Sí' : 'No'}</p>
              </div>
            )}
            
            <div className="space-y-3">
              <button
                onClick={() => navigate('/login')}
                className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Ir al Login
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="w-full py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Crear Nueva Cuenta
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                <Mail className="text-yellow-500" size={32} />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Verificación de Email</h1>
            <p className="text-gray-600 mb-6">
              No se encontró un código de verificación válido. Por favor, verifica el enlace que recibiste por email.
            </p>
            
            {isDevelopment && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-700">
                <p><strong>Debug Info:</strong></p>
                <p>URL: {location.pathname + location.search}</p>
                <p>Parámetros: {location.search}</p>
              </div>
            )}
            
            <div className="space-y-3">
              <button
                onClick={() => navigate('/login')}
                className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft size={16} />
                Volver al Login
              </button>
            </div>
          </>
        )}

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-left">
          <h3 className="font-medium text-blue-800 mb-2">💡 Consejos:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Verifica que el enlace esté completo</li>
            <li>• Los enlaces de verificación expiran después de 1 hora</li>
            <li>• Revisa tu carpeta de spam si no encuentras el email</li>
            {isDevelopment && (
              <li>• En desarrollo, revisa la consola para más información de debug</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification; 