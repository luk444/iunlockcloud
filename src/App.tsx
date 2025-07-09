import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar/Navbar';
import LiveActivityFeed from './components/LiveActivityFeed/LiveActivityFeed';
import Unlockdevice from './pages/Unlockdevice';
import Checkdevice from './pages/Checkdevice';
import BlacklistRemoval from './pages/BlacklistRemoval';
import UnlockGuide from './pages/UnlockGuide';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import MyDevices from './pages/MyDevices';
import Tickets from './pages/Tickets';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import Admin from './pages/Admin';
import AdminRoute from './components/AdminRoute/AdminRoute';
import NotFound from './pages/NotFound';
import AddCredits from './components/AddCredits/AddCredits';
import EmailVerification from './pages/EmailVerification';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import FirebaseAuthHandler from './components/FirebaseAuthHandler';

// Component to handle Firebase Auth redirects
const FirebaseAuthRedirectHandler: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check for Firebase Auth parameters in sessionStorage (from HTML script)
    const storedMode = sessionStorage.getItem('firebaseAuthMode');
    const storedCode = sessionStorage.getItem('firebaseAuthCode');
    const storedParams = sessionStorage.getItem('firebaseAuthParams');
    
    if (storedMode && storedCode) {
      console.log('Firebase Auth redirect detected from sessionStorage:', { 
        mode: storedMode, 
        code: `${storedCode.substring(0, 20)}...` 
      });
      
      // Clear the stored parameters
      sessionStorage.removeItem('firebaseAuthMode');
      sessionStorage.removeItem('firebaseAuthCode');
      sessionStorage.removeItem('firebaseAuthParams');
      
      // Redirect to the appropriate handler
      if (storedMode === 'resetPassword') {
        navigate(`/reset-password?oobCode=${encodeURIComponent(storedCode)}`);
      } else if (storedMode === 'verifyEmail') {
        navigate(`/__/auth/action?mode=${storedMode}&oobCode=${encodeURIComponent(storedCode)}`);
      } else {
        navigate(`/__/auth/action?${storedParams}`);
      }
      return;
    }
    
    // Check if we're on the root path with Firebase Auth parameters (fallback)
    if (location.pathname === '/' && location.search) {
      const searchParams = new URLSearchParams(location.search);
      const mode = searchParams.get('mode');
      const oobCode = searchParams.get('oobCode');
      
      if (mode && oobCode) {
        console.log('Firebase Auth redirect detected from URL:', { mode, oobCode: `${oobCode.substring(0, 20)}...` });
        
        // Redirect to the appropriate handler
        if (mode === 'resetPassword') {
          navigate(`/reset-password?oobCode=${encodeURIComponent(oobCode)}`);
        } else if (mode === 'verifyEmail') {
          navigate(`/__/auth/action?mode=${mode}&oobCode=${encodeURIComponent(oobCode)}`);
        } else {
          navigate(`/__/auth/action?${location.search.substring(1)}`);
        }
      }
    }
  }, [location, navigate]);

  return null;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="bg-gray-50">
          <FirebaseAuthRedirectHandler />
          <LiveActivityFeed />
          <Navbar />
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/register" element={<Unlockdevice />} />
            <Route path="/home" element={<Home />} />
            <Route path="/check" element={<Checkdevice />} />
            <Route path="/blacklist" element={<BlacklistRemoval />} />
            <Route path="/guide" element={<UnlockGuide />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/verify-email" element={<EmailVerification />} />
            <Route path="/__/auth/action" element={<FirebaseAuthHandler />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            {/* Protected routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/devices" element={<MyDevices />} />
              <Route path="/tickets" element={<Tickets />} />
              <Route path="/credits" element={<AddCredits />} />
            </Route>
            <Route 
              path="/admin" 
              element={
                <AdminRoute>
                  <Admin />
                </AdminRoute>
              } 
            />
            
            {/* 404 for any other routes */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster position="top-right" />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App