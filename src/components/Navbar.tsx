import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Plus, Home, List, BarChart3, LogIn, LogOut, User, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAdmin, isLoggedIn } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Home', icon: Home, requireAuth: false },
    { path: '/items', label: 'Community Board', icon: List, requireAuth: false },
    ...(isLoggedIn ? [{ path: '/post', label: 'Post a Flyer', icon: Plus, requireAuth: true }] : []),
    ...(isAdmin ? [{ path: '/dashboard', label: 'Admin Panel', icon: BarChart3, requireAuth: true }] : []),
  ];

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b-2 border-warmgreen-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-warmgreen-500 rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow border-2 border-warmgreen-300">
                <span className="text-xl">🏘️</span>
              </div>
              <div className="hidden sm:block">
                <span className="text-lg font-extrabold text-warmgreen-800 tracking-tight">NeighborFind</span>
                <p className="text-[10px] text-cork-500 -mt-0.5 font-semibold tracking-widest uppercase">Community Lost & Found</p>
              </div>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200
                  ${isActive(path)
                    ? 'bg-warmgreen-100 text-warmgreen-800 shadow-sm ring-1 ring-warmgreen-200'
                    : 'text-gray-600 hover:text-warmgreen-700 hover:bg-warmgreen-50'
                  }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </Link>
            ))}

            {/* Auth */}
            {isLoggedIn ? (
              <div className="relative ml-2">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-2 rounded-full bg-cork-100 hover:bg-cork-200 border border-cork-300 transition-colors"
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                    isAdmin ? 'bg-sunset-500' : 'bg-warmgreen-500'
                  }`}>
                    {user?.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold text-gray-700 hidden lg:block max-w-[100px] truncate">{user?.name}</span>
                  {isAdmin && <Shield className="w-3.5 h-3.5 text-sunset-500" />}
                </button>

                {showUserMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)}></div>
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-cork-200 py-2 z-50">
                      <div className="px-4 py-3 border-b border-cork-100">
                        <p className="font-bold text-gray-800 truncate">{user?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full mt-1 ${
                          isAdmin ? 'bg-sunset-100 text-sunset-700' : 'bg-warmgreen-100 text-warmgreen-700'
                        }`}>
                          {isAdmin ? '🛡️ Admin' : '👤 Member'}
                        </span>
                      </div>
                      <Link
                        to="/my-items"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-cork-50 transition-colors"
                      >
                        <User className="w-4 h-4" /> My Flyers
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full text-left transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-2">
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-gray-600 hover:text-warmgreen-700 hover:bg-warmgreen-50 rounded-full transition-all"
                >
                  <LogIn className="w-4 h-4" /> Sign In
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-white bg-warmgreen-500 hover:bg-warmgreen-600 rounded-full shadow-md transition-all"
                >
                  Join
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-full text-gray-600 hover:text-warmgreen-700 hover:bg-warmgreen-50 transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden border-t border-warmgreen-100 bg-white/98 backdrop-blur-md shadow-lg">
          <div className="px-4 py-3 space-y-1">
            {isLoggedIn && (
              <div className="flex items-center gap-3 px-4 py-3 mb-2 bg-cork-50 rounded-xl border border-cork-200">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                  isAdmin ? 'bg-sunset-500' : 'bg-warmgreen-500'
                }`}>
                  {user?.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-gray-800 text-sm">{user?.name}</p>
                  <span className={`text-xs font-bold ${isAdmin ? 'text-sunset-600' : 'text-warmgreen-600'}`}>
                    {isAdmin ? '🛡️ Admin' : '👤 Member'}
                  </span>
                </div>
              </div>
            )}

            {navLinks.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all
                  ${isActive(path)
                    ? 'bg-warmgreen-100 text-warmgreen-800'
                    : 'text-gray-600 hover:text-warmgreen-700 hover:bg-warmgreen-50'
                  }`}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </Link>
            ))}

            {isLoggedIn && (
              <>
                <Link
                  to="/my-items"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-600 hover:text-warmgreen-700 hover:bg-warmgreen-50"
                >
                  <User className="w-5 h-5" />
                  <span>My Flyers</span>
                </Link>
                <button
                  onClick={() => { handleLogout(); setIsOpen(false); }}
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 w-full text-left"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              </>
            )}

            {!isLoggedIn && (
              <div className="pt-2 space-y-2 border-t border-cork-100 mt-2">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-warmgreen-700 bg-warmgreen-50 border border-warmgreen-200"
                >
                  <LogIn className="w-4 h-4" /> Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-white bg-warmgreen-500"
                >
                  Join the Community
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
