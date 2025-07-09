import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { applyActionCode, checkActionCode } from 'firebase/auth';
import { auth } from '../firebase/config';
import { RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const FirebaseAuthHandler: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const mode = searchParams.get('mode');
  const oobCode = searchParams.get('oobCode');
  const continueUrl = searchParams.get('continueUrl');

  useEffect(() => {
    const handleAuthAction = async () => {
      console.log('FirebaseAuthHandler - Debug Info:', {
        mode,
        oobCode: oobCode ? `${oobCode.substring(0, 20)}...` : null,
        continueUrl,
        searchParams: Object.fromEntries(searchParams.entries())
      });

      // If no mode or oobCode, redirect to login
      if (!mode || !oobCode) {
        console.log('No mode or oobCode found, redirecting to login');
        navigate('/login');
        return;
      }

      try {
        console.log('Handling Firebase Auth action:', { mode, oobCode: `${oobCode.substring(0, 20)}...` });

        switch (mode) {
          case 'resetPassword':
            // For password reset, we'll redirect to our reset password page
            try {
              const actionCodeInfo = await checkActionCode(auth, oobCode);
              console.log('Action code info:', actionCodeInfo);
              
              if (actionCodeInfo.operation === 'PASSWORD_RESET') {
                // Redirect to our reset password page with the code
                const resetUrl = `/reset-password?oobCode=${encodeURIComponent(oobCode)}`;
                console.log('Redirecting to reset password:', resetUrl);
                navigate(resetUrl);
                return;
              } else {
                throw new Error(`Invalid operation type: ${actionCodeInfo.operation}`);
              }
            } catch (checkError: any) {
              console.error('Error checking action code:', checkError);
              // If there's an error checking the code, still redirect to reset password
              // The ResetPassword component will handle the error
              const resetUrl = `/reset-password?oobCode=${encodeURIComponent(oobCode)}`;
              console.log('Redirecting to reset password despite error:', resetUrl);
              navigate(resetUrl);
              return;
            }
            break;

          case 'verifyEmail':
            try {
              await applyActionCode(auth, oobCode);
              setSuccess(true);
              toast.success('Email verified successfully!');
              setTimeout(() => {
                navigate('/login');
              }, 3000);
            } catch (verifyError: any) {
              console.error('Error verifying email:', verifyError);
              setError('Failed to verify email. Please try again.');
              toast.error('Failed to verify email');
            }
            break;

          case 'recoverEmail':
            try {
              await applyActionCode(auth, oobCode);
              setSuccess(true);
              toast.success('Email recovery completed!');
              setTimeout(() => {
                navigate('/login');
              }, 3000);
            } catch (recoverError: any) {
              console.error('Error recovering email:', recoverError);
              setError('Failed to recover email. Please try again.');
              toast.error('Failed to recover email');
            }
            break;

          default:
            console.warn(`Unsupported action mode: ${mode}`);
            navigate('/login');
            return;
        }
      } catch (error: any) {
        console.error('Error handling auth action:', error);
        
        let errorMessage = 'An error occurred while processing your request';
        
        if (error.code === 'auth/invalid-action-code') {
          errorMessage = 'Invalid or expired action code';
        } else if (error.code === 'auth/expired-action-code') {
          errorMessage = 'Action code has expired';
        } else if (error.code === 'auth/user-disabled') {
          errorMessage = 'User account has been disabled';
        } else if (error.code === 'auth/user-not-found') {
          errorMessage = 'User not found';
        }

        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    // Add a small delay to ensure the component is fully mounted
    const timer = setTimeout(handleAuthAction, 100);
    return () => clearTimeout(timer);
  }, [mode, oobCode, continueUrl, navigate, searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-sm p-6 text-center">
          <div className="flex justify-center mb-6">
            <RefreshCw className="animate-spin text-blue-500" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Processing Request</h1>
          <p className="text-gray-600">Please wait while we process your request...</p>
          
          {/* Debug info in development */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-3 bg-gray-100 rounded text-xs text-gray-600">
              <p><strong>Mode:</strong> {mode}</p>
              <p><strong>Code:</strong> {oobCode ? `${oobCode.substring(0, 20)}...` : 'None'}</p>
              <p><strong>Continue URL:</strong> {continueUrl || 'None'}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-sm p-6 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="text-red-500" size={32} />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          
          {/* Debug info in development */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-xs text-red-700">
              <p><strong>Debug Info:</strong></p>
              <p>Mode: {mode}</p>
              <p>Code: {oobCode ? `${oobCode.substring(0, 20)}...` : 'None'}</p>
              <p>Continue URL: {continueUrl || 'None'}</p>
            </div>
          )}
          
          <button
            onClick={() => navigate('/login')}
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-sm p-6 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="text-green-500" size={32} />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Success!</h1>
          <p className="text-gray-600 mb-6">Your request has been processed successfully.</p>
          <button
            onClick={() => navigate('/login')}
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default FirebaseAuthHandler; 