import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, CheckCircle, AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const EmailVerification: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyEmail, checkActionCode, currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [errorMessage, setErrorMessage] = useState('');

  // Firebase puede enviar el código con diferentes nombres de parámetros
  const oobCode = searchParams.get('oobCode') || 
                  searchParams.get('oobcode') || 
                  searchParams.get('code') ||
                  searchParams.get('actionCode') ||
                  searchParams.get('action_code') ||
                  searchParams.get('oobCode') ||
                  searchParams.get('continueUrl')?.split('oobCode=')[1]?.split('&')[0];

  // Verificar si estamos en la ruta correcta para Firebase Auth
  const isFirebaseAuthRoute = location.pathname === '/__/auth/action';

  useEffect(() => {
    const handleVerification = async () => {
      if (!oobCode) {
        console.log('No verification code found in parameters:', location.search);
        console.log('Complete URL:', window.location.href);
        console.log('Search parameters:', location.search);
        setVerificationStatus('error');
        setErrorMessage('Invalid verification code. Please verify that the link is complete.');
        return;
      }

      setLoading(true);
      try {
        console.log('Attempting to verify code:', oobCode);
        console.log('Complete URL:', window.location.href);
        
        // Verificar el código antes de aplicarlo
        const actionCodeInfo = await checkActionCode(oobCode);
        console.log('Action code information:', actionCodeInfo);
        
        if (actionCodeInfo.operation === 'VERIFY_EMAIL') {
          await verifyEmail(oobCode);
          setVerificationStatus('success');
          toast.success('Email verified successfully!');
          
          // Redirigir después de 3 segundos - si el usuario ya está autenticado, ir al home
          setTimeout(() => {
            if (currentUser) {
              navigate('/home');
            } else {
              navigate('/login');
            }
          }, 3000);
        } else {
          setVerificationStatus('error');
          setErrorMessage(`Invalid verification code. Operation: ${actionCodeInfo.operation}`);
        }
      } catch (error: any) {
        console.error('Error verifying email:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        setVerificationStatus('error');
        
        if (error.code === 'auth/invalid-action-code') {
          setErrorMessage('The verification code is invalid or has expired. Please request a new verification link.');
        } else if (error.code === 'auth/user-disabled') {
          setErrorMessage('The account has been disabled. Please contact support.');
        } else if (error.code === 'auth/expired-action-code') {
          setErrorMessage('The verification link has expired. Please request a new link.');
        } else if (error.code === 'auth/invalid-continue-uri') {
          setErrorMessage('Invalid redirect URL. Please contact support.');
        } else {
          setErrorMessage(`Error verifying email: ${error.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    if (oobCode) {
      handleVerification();
    }
  }, [oobCode, verifyEmail, checkActionCode, navigate, location.search, currentUser]);

  // Mostrar información de debug en desarrollo
  const isDevelopment = process.env.NODE_ENV === 'development';

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-28 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-sm p-6 text-center">
          <div className="flex justify-center mb-6">
            <RefreshCw className="animate-spin text-blue-500" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Verifying Email</h1>
          <p className="text-gray-600">Please wait while we verify your email...</p>
          
          {isDevelopment && oobCode && (
            <div className="mt-4 p-3 bg-gray-100 rounded text-xs text-gray-600">
              <p><strong>Debug:</strong> Code found: {oobCode.substring(0, 20)}...</p>
              <p>Firebase Auth Route: {isFirebaseAuthRoute ? 'Yes' : 'No'}</p>
              <p>Pathname: {location.pathname}</p>
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
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Email Verified!</h1>
            <p className="text-gray-600 mb-6">
              Your email address has been successfully verified. {currentUser ? 'You will be redirected to home in a few seconds.' : 'You will be redirected to login in a few seconds.'}
            </p>
            <button
              onClick={() => {
                if (currentUser) {
                  navigate('/home');
                } else {
                  navigate('/login');
                }
              }}
              className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              {currentUser ? 'Go to Home' : 'Go to Login'}
            </button>
          </>
        ) : verificationStatus === 'error' ? (
          <>
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="text-red-500" size={32} />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Verification Error</h1>
            <p className="text-gray-600 mb-6">{errorMessage}</p>
            
            {isDevelopment && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                <p><strong>Debug Info:</strong></p>
                <p>URL: {location.pathname + location.search}</p>
                <p>Complete URL: {window.location.href}</p>
                <p>Parameters: {location.search}</p>
                <p>Code found: {oobCode ? 'Yes' : 'No'}</p>
                {oobCode && <p>Code (first 20 chars): {oobCode.substring(0, 20)}...</p>}
                <p>User Agent: {navigator.userAgent}</p>
                <p>Firebase Auth Route: {isFirebaseAuthRoute ? 'Yes' : 'No'}</p>
                <p>Pathname: {location.pathname}</p>
              </div>
            )}
            
            <div className="space-y-3">
              <button
                onClick={() => {
                  if (currentUser) {
                    navigate('/home');
                  } else {
                    navigate('/login');
                  }
                }}
                className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                {currentUser ? 'Go to Home' : 'Go to Login'}
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="w-full py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Create New Account
              </button>
              
              {isDevelopment && (
                <button
                  onClick={() => {
                    console.log('Debug information:');
                    console.log('Current URL:', window.location.href);
                    console.log('Pathname:', location.pathname);
                    console.log('Search:', location.search);
                    console.log('OobCode:', oobCode);
                    console.log('Is Firebase Auth Route:', isFirebaseAuthRoute);
                  }}
                  className="w-full py-2 px-4 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
                >
                  Debug Info (check console)
                </button>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                <Mail className="text-yellow-500" size={32} />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Email Verification</h1>
            <p className="text-gray-600 mb-6">
              No valid verification code found. Please verify the link you received by email.
            </p>
            
            {isDevelopment && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-700">
                <p><strong>Debug Info:</strong></p>
                <p>URL: {location.pathname + location.search}</p>
                <p>Complete URL: {window.location.href}</p>
                <p>Parameters: {location.search}</p>
                <p>Firebase Auth Route: {isFirebaseAuthRoute ? 'Yes' : 'No'}</p>
                <p>Pathname: {location.pathname}</p>
              </div>
            )}
            
            <div className="space-y-3">
              <button
                onClick={() => {
                  if (currentUser) {
                    navigate('/home');
                  } else {
                    navigate('/login');
                  }
                }}
                className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                {currentUser ? 'Go to Home' : 'Go to Login'}
              </button>
            </div>
          </>
        )}

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-left">
          <h3 className="font-medium text-blue-800 mb-2">💡 Tips:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Make sure the link is complete</li>
            <li>• Verification links expire after 1 hour</li>
            <li>• Check your spam folder if you can't find the email</li>
            {isDevelopment && (
              <li>• In development, check the console for more debug information</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification; 