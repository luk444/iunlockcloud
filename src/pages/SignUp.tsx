import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { validatePassword, validateEmail } from '../utils/validation';
import toast from 'react-hot-toast';

const SignUp: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const passwordValidation = validatePassword(password);
  const isEmailValid = validateEmail(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !confirmPassword) {
      toast.error('Please complete all fields');
      return;
    }
    
    if (!isEmailValid) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    if (!passwordValidation.isValid) {
      toast.error('Please correct the password requirements.');
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await register(email, password);
      setEmailSent(true);
      toast.success('¡Account created! Please check your email to verify your account.');
    } catch (error: any) {
      console.error('Registration error:', error);
      if (error.code === 'auth/email-already-in-use') {
        toast.error('This email is already registered. Please use a different email or try logging in.');
      } else if (error.code === 'auth/weak-password') {
        toast.error('The password is too weak. Please choose a stronger password.');
      } else if (error.code === 'auth/invalid-email') {
        toast.error('Invalid email address. Please enter a valid email address.');
      } else {
        toast.error(error.message || 'Error creating account');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gray-50 pt-28 flex items-center justify-center px-4">
        <div className="max-w-md w-full card fade-in text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <Mail className="text-green-500" size={32} />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Check your Email</h1>
          
          <p className="text-gray-600 mb-6">
            We have sent a verification link to <strong>{email}</strong>. 
            Please click the link in your email to verify your account before logging in.
          </p>
          
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-left">
              <h3 className="font-medium text-blue-800 mb-2">Next Steps:</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Check your inbox (and spam folder)</li>
                <li>• Click the verification link</li>
                <li>• Come back here to log in</li>
              </ul>
            </div>
            
            <Link
              to="/login"
              className="w-full btn btn-primary inline-flex items-center justify-center"
            >
              Go to LogIn
            </Link>
            
            <button
              onClick={() => {
                setEmailSent(false);
                setEmail('');
                setPassword('');
                setConfirmPassword('');
              }}
              className="w-full btn btn-secondary"
            >
              Use Different Email
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-28 flex items-center justify-center px-4">
      <div className="max-w-md w-full card fade-in">
        <div className="flex items-center gap-2 mb-6">
          <UserPlus className="text-blue-500" size={24} />
          <h1 className="text-2xl font-bold text-gray-800">Create Account</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`input ${email && !isEmailValid ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
              placeholder="you@email.com"
            />
            {email && !isEmailValid && (
              <p className="text-red-500 text-xs mt-1">Please enter a valid email address</p>
            )}
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password *
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`input pr-10 ${password && !passwordValidation.isValid ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            
            {password && (
              <div className="mt-2 space-y-1">
                <div className="text-xs space-y-1">
                  <div className={`flex items-center gap-1 ${password.length >= 8 ? 'text-green-600' : 'text-red-500'}`}>
                    {password.length >= 8 ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                    At least 8 characters
                  </div>
                  <div className={`flex items-center gap-1 ${/[a-z]/.test(password) ? 'text-green-600' : 'text-red-500'}`}>
                    {/[a-z]/.test(password) ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                    A lowercase letter
                  </div>
                  <div className={`flex items-center gap-1 ${/\d/.test(password) ? 'text-green-600' : 'text-red-500'}`}>
                    {/\d/.test(password) ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                    A Number
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password *
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`input pr-10 ${confirmPassword && password !== confirmPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {confirmPassword && password !== confirmPassword && (
              <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
            )}
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting || !passwordValidation.isValid || !isEmailValid || password !== confirmPassword}
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating account...
              </div>
            ) : (
              'Create Account'
            )}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-500 hover:text-blue-700 font-medium">
              LogIn
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;