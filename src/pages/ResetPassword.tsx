import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Lock, CheckCircle, AlertCircle, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { applyActionCode, checkActionCode } from 'firebase/auth';
import { auth } from '../firebase/config';
import toast from 'react-hot-toast';

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { confirmPasswordReset, checkActionCode: checkActionCodeAuth } = useAuth();
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [validCode, setValidCode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  // Firebase can send the code with different parameter names
  const oobCode = searchParams.get('oobCode') || 
                  searchParams.get('oobcode') || 
                  searchParams.get('code') ||
                  searchParams.get('actionCode') ||
                  searchParams.get('action_code') ||
                  searchParams.get('continueUrl')?.split('oobCode=')[1]?.split('&')[0] ||
                  // Try to extract from the full URL if it's encoded
                  (() => {
                    const url = window.location.href;
                    const oobCodeMatch = url.match(/[?&]oobCode=([^&]+)/i);
                    return oobCodeMatch ? decodeURIComponent(oobCodeMatch[1]) : null;
                  })() ||
                  (() => {
                    const url = window.location.href;
                    const codeMatch = url.match(/[?&]code=([^&]+)/i);
                    return codeMatch ? decodeURIComponent(codeMatch[1]) : null;
                  })();

  // Check if we're in a Firebase Auth action URL
  const isFirebaseAuthAction = location.pathname === '/__/auth/action' || 
                              location.pathname.includes('/auth/action') ||
                              searchParams.get('mode') === 'resetPassword';

  useEffect(() => {
    const verifyCode = async () => {
      // Debug information
      console.log('Full URL:', window.location.href);
      console.log('Search params:', location.search);
      console.log('All search params:', Object.fromEntries(searchParams.entries()));
      console.log('Is Firebase Auth Action:', isFirebaseAuthAction);
      
      if (!oobCode) {
        console.log('No reset code found in parameters:', location.search);
        setVerifying(false);
        return;
      }

      try {
        console.log('Verifying reset code:', oobCode);
        console.log('Code length:', oobCode.length);
        
        // Use Firebase Auth directly if we're in a Firebase Auth action
        let actionCodeInfo;
        if (isFirebaseAuthAction) {
          actionCodeInfo = await checkActionCode(auth, oobCode);
        } else {
          actionCodeInfo = await checkActionCodeAuth(oobCode);
        }
        
        console.log('Action code info:', actionCodeInfo);
        
        if (actionCodeInfo.operation === 'PASSWORD_RESET') {
          setValidCode(true);
          setEmail(actionCodeInfo.data?.email || '');
        } else {
          setValidCode(false);
          console.error('Invalid operation type:', actionCodeInfo.operation);
        }
      } catch (error: any) {
        console.error('Error verifying reset code:', error);
        setValidCode(false);
        
        // Show specific error messages
        if (error.code === 'auth/invalid-action-code') {
          toast.error('Invalid or expired reset code');
        } else if (error.code === 'auth/expired-action-code') {
          toast.error('Reset code has expired. Please request a new one.');
        } else {
          toast.error('Error verifying reset code. Please try again.');
        }
      } finally {
        setVerifying(false);
      }
    };

    verifyCode();
  }, [oobCode, checkActionCodeAuth, location.search, isFirebaseAuthAction]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!oobCode) {
      toast.error('Invalid reset code');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    try {
      setLoading(true);
      await confirmPasswordReset(oobCode, password);
      setResetSuccess(true);
      toast.success('Password reset successfully!');
      
      // Redirect after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error: any) {
      console.error('Error resetting password:', error);
      
      if (error.code === 'auth/invalid-action-code') {
        toast.error('Invalid or expired reset code');
      } else if (error.code === 'auth/expired-action-code') {
        toast.error('Reset code has expired. Please request a new one.');
      } else if (error.code === 'auth/weak-password') {
        toast.error('Password is too weak');
      } else {
        toast.error(`Error resetting password: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Show debug information in development
  const isDevelopment = process.env.NODE_ENV === 'development';

  if (verifying) {
    return (
      <div className="bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-sm p-6 text-center">
          <div className="flex justify-center mb-6">
            <RefreshCw className="animate-spin text-blue-500" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Verifying Code</h1>
          <p className="text-gray-600">Please wait while we verify your code...</p>
          
          {isDevelopment && oobCode && (
            <div className="mt-4 p-3 bg-gray-100 rounded text-xs text-gray-600">
              <p><strong>Debug:</strong> Code found: {oobCode.substring(0, 20)}...</p>
              <p><strong>Firebase Auth Action:</strong> {isFirebaseAuthAction ? 'Yes' : 'No'}</p>
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
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Invalid Code</h1>
          <p className="text-gray-600 mb-6">
            The reset code is invalid or has expired. Please request a new link.
          </p>
          
          {isDevelopment && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-xs text-red-700">
              <p><strong>Debug Info:</strong></p>
              <p>URL: {location.pathname + location.search}</p>
              <p>Parameters: {location.search}</p>
              <p>Code found: {oobCode ? 'Yes' : 'No'}</p>
              <p>Firebase Auth Action: {isFirebaseAuthAction ? 'Yes' : 'No'}</p>
            </div>
          )}
          
          <button
            onClick={() => navigate('/forgot-password')}
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Request New Link
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
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Password Reset!</h1>
          <p className="text-gray-600 mb-6">
            Your password has been reset successfully. You will be redirected to login in a few seconds.
          </p>
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
          <h2 className="text-3xl font-bold text-gray-900 mb-2">New Password</h2>
          <p className="text-gray-600">
            Enter your new password for account <strong>{email}</strong>
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                New Password
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
                  placeholder="Enter your new password"
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
                Confirm Password
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
                  placeholder="Confirm your new password"
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
                  Resetting...
                </>
              ) : (
                <>
                  <Lock className="h-5 w-5" />
                  Reset Password
                </>
              )}
            </button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <h3 className="font-medium text-blue-800 mb-2">💡 Password Requirements:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Minimum 6 characters</li>
              <li>• Use a combination of letters and numbers</li>
              <li>• Avoid using personal information</li>
              {isDevelopment && (
                <li>• In development, check the console for more debug information</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword; 