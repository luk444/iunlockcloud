import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ArrowLeft, Shield, Search, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const NotFound: React.FC = () => {
  const location = useLocation();
  const { currentUser } = useAuth();
  
  // Check if this is an admin route attempt without proper authentication
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isUnauthorizedAdmin = isAdminRoute && (!currentUser || !currentUser.isAdmin);

  if (isUnauthorizedAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-red-100 to-red-200 px-4 pt-28">
        <div className="text-center max-w-md">
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-6">
              <Shield className="h-12 w-12 text-red-500" />
            </div>
            <div className="space-y-2">
              <h1 className="text-6xl font-bold text-red-600">403</h1>
              <h2 className="text-2xl font-bold text-red-800">Access Denied</h2>
            </div>
          </div>
          
          <p className="text-lg text-red-700 mb-8 leading-relaxed">
            You don't have permission to access this admin area. Please contact an administrator if you believe this is an error.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/home"
              className="inline-flex items-center justify-center px-6 py-3 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <Home className="mr-2" size={18} />
              Go to Home
            </Link>
            {!currentUser && (
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-red-500 text-red-600 font-medium rounded-lg hover:bg-red-50 transition-all duration-300 transform hover:scale-105"
              >
                <Shield className="mr-2" size={18} />
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-200 px-4 pt-28">
      <div className="text-center max-w-lg">
        {/* 404 Animation */}
        <div className="mb-8">
          <div className="relative">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full flex items-center justify-center mb-6 shadow-lg">
              <Search className="h-16 w-16 text-blue-500 animate-pulse" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-4 w-4 text-white" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-8xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              404
            </h1>
            <h2 className="text-3xl font-bold text-gray-800">Page Not Found</h2>
          </div>
        </div>
        
        <div className="space-y-4 mb-8">
          <p className="text-xl text-gray-600 leading-relaxed">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
          <p className="text-gray-500">
            Don't worry, let's get you back on track with our iPhone unlocking services.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/50 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              to="/register"
              className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 text-sm font-medium"
            >
              <Shield size={16} />
              Register Device
            </Link>
            <Link
              to="/check"
              className="flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-300 transform hover:scale-105 text-sm font-medium"
            >
              <Search size={16} />
              Check Device
            </Link>
            <Link
              to="/blacklist"
              className="flex items-center justify-center gap-2 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300 transform hover:scale-105 text-sm font-medium"
            >
              <AlertTriangle size={16} />
              Blacklist Removal
            </Link>
            <Link
              to="/guide"
              className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all duration-300 transform hover:scale-105 text-sm font-medium"
            >
              <Shield size={16} />
              Unlock Guide
            </Link>
          </div>
        </div>
        
        {/* Main Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/home"
            className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <Home className="mr-2" size={20} />
            Go to Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 transform hover:scale-105"
          >
            <ArrowLeft className="mr-2" size={20} />
            Go Back
          </button>
        </div>

        {/* Help Text */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <p className="text-sm text-blue-700">
            <strong>Need help?</strong> If you believe this is an error, please contact our support team or try one of the quick actions above.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;