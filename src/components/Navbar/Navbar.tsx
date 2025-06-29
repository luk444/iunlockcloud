import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Smartphone, Book, User, LogOut, Menu, X, FileText, Shield, AlertTriangle, ChevronDown, Plus, Globe } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import logoApple from '../../assets/logoapple.png';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [language, setLanguage] = useState<'en' | 'es'>('es');
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isOpen && !target.closest('.mobile-menu') && !target.closest('.mobile-toggle')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

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
    import('react-hot-toast').then(({ default: toast }) => {
      toast.success(`Idioma cambiado a ${language === 'en' ? 'Español' : 'English'}`);
    });
  };

  const getText = (en: string, es: string) => {
    return language === 'en' ? en : es;
  };

  return (
    <nav className={`fixed left-0 right-0 z-40 transition-all duration-300 ${scrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-md'}`} style={{ top: 'var(--live-feed-height)', height: 'var(--navbar-height)' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-full">
        <div className="flex justify-between items-center h-full">
          {/* Logo */}
          <Link to="/home" className="flex items-center gap-2 flex-shrink-0">
            <img src={logoApple} alt="Logo" className="h-8 w-8" />
            <span className="font-bold text-lg sm:text-xl text-gray-800 hidden sm:block">iUnlock-Cloud</span>
            <span className="font-bold text-lg text-gray-800 sm:hidden">iUnlock</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
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
          <div className="hidden lg:flex items-center gap-3 relative">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md transition-colors"
            >
              <Globe size={16} />
              {getText("ES", "EN")}
            </button>

            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md transition-colors"
                >
                  <User size={16} />
                  <span className="hidden sm:inline">{currentUser.email?.split('@')[0] || 'Usuario'}</span>
                  <span className="sm:hidden">Usuario</span>
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
                      className="block px-4 py-2 text-sm text-green-600 hover:bg-green-50 transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Plus size={16} className="inline mr-1" />
                      {getText("Add Credits", "Agregar Créditos")}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={16} className="inline mr-1" />
                      {getText("Logout", "Cerrar Sesión")}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex gap-2">
                <Link to="/login" className="text-sm px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors">
                  {getText("Login", "Iniciar Sesión")}
                </Link>
                <Link to="/signup" className="text-sm px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors">
                  {getText("Sign Up", "Registrarse")}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="lg:hidden mobile-toggle">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="text-gray-700 p-2 rounded-md hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden mobile-menu bg-white shadow-lg border-t border-gray-200">
          <div className="px-4 py-3 space-y-1">
            {/* Main navigation links */}
            <div className="space-y-1">
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
            </div>

            {/* Language toggle for mobile */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 text-gray-700 py-3 px-3 w-full rounded-md hover:bg-gray-50 transition-colors"
            >
              <Globe size={18} />
              {getText("Cambiar a Español", "Switch to English")}
            </button>

            {/* Auth section */}
            <div className="pt-3 border-t border-gray-200 space-y-1">
              {currentUser ? (
                <>
                  <div className="px-3 py-2">
                    <p className="text-sm text-gray-600 truncate">{currentUser.email}</p>
                    <p className="text-sm text-blue-600 font-medium">{getText("Credits", "Créditos")}: {currentUser.credits || 0}</p>
                  </div>
                  <Link
                    to="/credits"
                    className="flex items-center gap-2 text-green-600 py-3 px-3 rounded-md hover:bg-green-50 transition-colors"
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
                    className="flex items-center gap-2 text-red-600 py-3 px-3 w-full rounded-md hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={18} />
                    {getText("Logout", "Cerrar Sesión")}
                  </button>
                </>
              ) : (
                <div className="space-y-1">
                  <MobileLink to="/login" label={getText("Login", "Iniciar Sesión")} />
                  <MobileLink to="/signup" label={getText("Sign Up", "Registrarse")} primary />
                </div>
              )}
            </div>
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
  const base = `block px-3 py-3 rounded-md text-base font-medium transition-colors flex items-center gap-3`;
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