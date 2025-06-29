import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
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
            <Route path="/__/auth/action" element={<EmailVerification />} />
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