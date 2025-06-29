import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Smartphone, Book, User, LogOut, Menu, X, FileText, Shield, AlertTriangle, ChevronDown, Plus, Globe } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import logoApple from '../../assets/logoapple.png';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [language, setLanguage] = useState<'en' | 'es'>('en');
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'es' : 'en');
    // Here you would implement actual language switching logic
    // For now, we'll just show a toast notification
    import('react-hot-toast').then(({ default: toast }) => {
      toast.success(`Idioma cambiado a ${language === 'en' ? 'Español' : 'English'}`);
    });
  };

  const getText = (en: string, es: string) => {
    return language === 'en' ? en : es;
  };

  return (
    <nav className={`fixed top-11 left-0 right-0 z-40 transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-white/90 backdrop-blur-md'}`}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/home" className="flex items-center gap-2">
            <img src={logoApple} alt="Logo" className="h-8 w-8" />
            <span className="font-bold text-xl text-gray-800">iUnlock-Cloud</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/register" icon={<Plus size={16} />} label={getText("Register", "Registrar")} />
            <NavLink to="/check" icon={<Book size={16} />} label={getText("Check", "Verificar")} />
            <NavLink to="/blacklist" icon={<AlertTriangle size={16} />} label="Blacklist" danger />
            {currentUser && (
              <>
                <NavLink to="/devices" icon={<Smartphone size={16} />} label={getText("My Devices", "Mis Dispositivos")} />
                <NavLink to="/tickets" icon={<FileText size={16} />} label="Tickets" />
                {currentUser.isAdmin && (
                  <NavLink to="/admin" icon={<Shield size={16} />} label="Admin" />
                )}
              </>
            )}
          </div>

          {/* Language Toggle & Auth/User section */}
          <div className="hidden md:flex items-center gap-3 relative">
            {/* Language Toggle */}
           

            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md"
                >
                  <User size={16} />
                  {currentUser.email.split('@')[0]}
                  <ChevronDown size={16} />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border shadow-lg rounded-md z-50">
                    <div className="px-4 py-2 text-sm text-gray-600 border-b">{currentUser.email}</div>
                    <div className="px-4 py-2 text-sm text-blue-600 border-b">
                      {getText("Credits", "Créditos")}: {currentUser.credits || 0}
                    </div>
                    <Link
                      to="/credits"
                      className="block px-4 py-2 text-sm text-green-600 hover:bg-green-50"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Plus size={16} className="inline mr-1" />
                      {getText("Add Credits", "Agregar Créditos")}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut size={16} className="inline mr-1" />
                      {getText("Logout", "Cerrar Sesión")}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex gap-2">
                <Link to="/login" className="text-sm px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100">
                  {getText("Login", "Iniciar Sesión")}
                </Link>
                <Link to="/signup" className="text-sm px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600">
                  {getText("Sign Up", "Registrarse")}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700 p-2 rounded-md hover:bg-gray-100">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md px-4 py-2 space-y-1">
          <MobileLink to="/register" icon={<Plus size={18} />} label={getText("Register", "Registrar")} />
          <MobileLink to="/check" icon={<Book size={18} />} label={getText("Check", "Verificar")} />
          <MobileLink to="/blacklist" icon={<AlertTriangle size={18} />} label="Blacklist" danger />
          {currentUser && (
            <>
              <MobileLink to="/devices" icon={<Smartphone size={18} />} label={getText("My Devices", "Mis Dispositivos")} />
              <MobileLink to="/tickets" icon={<FileText size={18} />} label="Tickets" />
              {currentUser.isAdmin && (
                <MobileLink to="/admin" icon={<Shield size={18} />} label="Admin" />
              )}
            </>
          )}

          {/* Language toggle for mobile */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 text-gray-700 py-2 w-full"
          >
            <Globe size={18} />
            {getText("Español", "English")}
          </button>

          {/* Auth section */}
          <div className="pt-4 border-t border-gray-200">
            {currentUser ? (
              <>
                <p className="text-sm text-gray-600">{currentUser.email}</p>
                <p className="text-sm text-blue-600">{getText("Credits", "Créditos")}: {currentUser.credits || 0}</p>
                <Link
                  to="/credits"
                  className="flex items-center gap-2 text-green-600 py-2"
                  onClick={() => setIsOpen(false)}
                >
                  <Plus size={18} />
                  {getText("Add Credits", "Agregar Créditos")}
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-2 text-red-600 py-2"
                >
                  <LogOut size={18} />
                  {getText("Logout", "Cerrar Sesión")}
                </button>
              </>
            ) : (
              <>
                <MobileLink to="/login" label={getText("Login", "Iniciar Sesión")} />
                <MobileLink to="/signup" label={getText("Sign Up", "Registrarse")} primary />
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

// Reusable desktop navlink
const NavLink = ({ to, icon, label, danger = false }: any) => {
  const { pathname } = useLocation();
  const isActive = pathname === to;
  const base = `px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5`;
  const activeStyle = danger
    ? 'text-red-600 bg-red-50'
    : 'text-blue-600 bg-blue-50';
  const inactiveStyle = danger
    ? 'text-gray-700 hover:text-red-600 hover:bg-red-50'
    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50';
  return (
    <Link to={to} className={`${base} ${isActive ? activeStyle : inactiveStyle}`}>
      {icon}
      {label}
    </Link>
  );
};

// Reusable mobile link
const MobileLink = ({ to, icon, label, primary = false, danger = false }: any) => {
  const { pathname } = useLocation();
  const isActive = pathname === to;
  const base = `block px-3 py-2 rounded-md text-base font-medium transition-colors flex items-center gap-2`;
  let activeStyle = primary
    ? 'bg-blue-500 text-white'
    : danger
    ? 'text-red-600 bg-red-50'
    : 'text-blue-600 bg-blue-50';

  let hoverStyle = primary
    ? 'hover:bg-blue-600'
    : danger
    ? 'hover:text-red-600 hover:bg-red-50'
    : 'hover:text-blue-600 hover:bg-blue-50';

  return (
    <Link to={to} className={`${base} ${isActive ? activeStyle : `text-gray-700 ${hoverStyle}`}`}>
      {icon}
      {label}
    </Link>
  );
};

export default Navbar;