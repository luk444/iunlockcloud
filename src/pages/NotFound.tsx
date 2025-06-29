import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ArrowLeft, Shield, Search, AlertTriangle, Lock, Smartphone, BookOpen } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const NotFound: React.FC = () => {
  const location = useLocation();
  const { currentUser } = useAuth();
  
  // Check if this is an admin route attempt without proper authentication
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isUnauthorizedAdmin = isAdminRoute && (!currentUser || !currentUser.isAdmin);

  if (isUnauthorizedAdmin) {
    return (
      <div className="h-[90vh] flex items-center justify-center bg-gradient-to-br from-red-50 via-red-100 to-red-200 px-4 overflow-hidden">
        <div className="text-center max-w-md">
          <div className="mb-6">
            <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
              <Lock className="h-10 w-10 text-red-500" />
            </div>
            <div className="space-y-1">
              <h1 className="text-5xl font-bold text-red-600">403</h1>
              <h2 className="text-xl font-semibold text-red-800">Access Denied</h2>
            </div>
          </div>
          
          <p className="text-base text-red-700 mb-6 leading-relaxed">
            You don't have permission to access this admin area. Please contact an administrator if you believe this is an error.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/home"
              className="inline-flex items-center justify-center px-5 py-2.5 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-all duration-200 transform hover:scale-105 shadow-md"
            >
              <Home className="mr-2" size={16} />
              Go to Home
            </Link>
            {!currentUser && (
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-5 py-2.5 border-2 border-red-500 text-red-600 font-medium rounded-lg hover:bg-red-50 transition-all duration-200 transform hover:scale-105"
              >
                <Shield className="mr-2" size={16} />
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[90vh] flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4 overflow-hidden">
      <div className="text-center max-w-2xl w-full">
        {/* Header Section */}
        <div className="mb-8">
          <div className="relative inline-block mb-6">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
              <Search className="h-12 w-12 text-blue-600" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-md">
              <AlertTriangle className="h-3 w-3 text-white" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              404
            </h1>
            <h2 className="text-2xl font-semibold text-gray-800">Page Not Found</h2>
          </div>
        </div>
        
        {/* Description */}
        <div className="mb-8">
          <p className="text-lg text-gray-600 leading-relaxed mb-2">
            Sorry, the page you're looking for doesn't exist or has been moved.
          </p>
          <p className="text-gray-500 text-sm">
            Don't worry, let's get you back on track with our iPhone unlocking services.
          </p>
        </div>

        {/* Quick Actions Grid */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-white/50 mb-6">
          <h3 className="text-base font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/register"
              className="flex items-center justify-center gap-2 px-3 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 transform hover:scale-105 text-sm font-medium shadow-sm"
            >
              <Smartphone size={14} />
              Register
            </Link>
            <Link
              to="/check"
              className="flex items-center justify-center gap-2 px-3 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200 transform hover:scale-105 text-sm font-medium shadow-sm"
            >
              <Search size={14} />
              Check
            </Link>
            <Link
              to="/blacklist"
              className="flex items-center justify-center gap-2 px-3 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 transform hover:scale-105 text-sm font-medium shadow-sm"
            >
              <AlertTriangle size={14} />
              Blacklist
            </Link>
            <Link
              to="/guide"
              className="flex items-center justify-center gap-2 px-3 py-2.5 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all duration-200 transform hover:scale-105 text-sm font-medium shadow-sm"
            >
              <BookOpen size={14} />
              Guide
            </Link>
          </div>
        </div>
        
        {/* Main Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
          <Link
            to="/home"
            className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <Home className="mr-2" size={18} />
            Go to Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 transform hover:scale-105"
          >
            <ArrowLeft className="mr-2" size={18} />
            Go Back
          </button>
        </div>

        {/* Help Section */}
        <div className="bg-blue-50/80 border border-blue-200/50 rounded-lg p-4">
          <p className="text-xs text-blue-700">
            <strong>Need help?</strong> If you believe this is an error, please contact our support team or try one of the quick actions above.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;