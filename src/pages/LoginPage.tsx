import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const result = login(email, password);
      if (result.success) {
        navigate('/');
      } else {
        setError(result.error || 'Login failed.');
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-cork-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-14 h-14 bg-warmgreen-500 rounded-full flex items-center justify-center shadow-lg border-3 border-warmgreen-300">
              <span className="text-3xl">🏘️</span>
            </div>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900">Welcome Back!</h1>
          <p className="text-gray-500 mt-1">Sign in to your NeighborFind account</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-cork-200 p-8">
          {/* Demo Accounts Info */}
          <div className="bg-warmgreen-50 border border-warmgreen-200 rounded-xl p-4 mb-6">
            <p className="text-xs font-bold text-warmgreen-800 mb-2">🔑 Demo Accounts</p>
            <div className="space-y-1.5 text-xs text-warmgreen-700">
              <div className="flex justify-between items-center bg-white/60 rounded-lg px-3 py-1.5">
                <span><strong>Admin:</strong> admin@neighborfind.com</span>
                <span className="text-warmgreen-500">admin123</span>
              </div>
              <div className="flex justify-between items-center bg-white/60 rounded-lg px-3 py-1.5">
                <span><strong>User:</strong> juan@email.com</span>
                <span className="text-warmgreen-500">user123</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-5 flex items-center gap-2 text-sm text-red-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="w-full px-4 py-3 rounded-xl border border-cork-200 bg-cork-50 focus:ring-2 focus:ring-warmgreen-400 focus:border-warmgreen-400 outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 rounded-xl border border-cork-200 bg-cork-50 focus:ring-2 focus:ring-warmgreen-400 focus:border-warmgreen-400 outline-none text-sm pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-warmgreen-500 to-warmgreen-600 text-white rounded-xl font-bold shadow-md hover:shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Don't have an account?{' '}
              <Link to="/register" className="text-warmgreen-600 hover:text-warmgreen-700 font-bold hover:underline">
                Join the Community
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
