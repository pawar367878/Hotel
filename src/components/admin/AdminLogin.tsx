import React, { useState } from 'react';
import { api } from '../../services/api';
import { useRestaurant } from '../../context/RestaurantContext';
import { Shield, Key, Lock, ArrowLeft, Flame, AlertCircle, User } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { setIsAdminLoggedIn, setIsAdminView, showToast } = useRestaurant();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!username.trim()) {
      setError('Please enter the admin username');
      return;
    }
    if (!password) {
      setError('Please enter the admin password');
      return;
    }

    try {
      setIsLoading(true);
      const res = await api.adminLogin(username.trim(), password);
      if (res.success) {
        if (res.token) {
          localStorage.setItem('h12m_admin_token', res.token);
        }
        setIsAdminLoggedIn(true);
        showToast('✓ 12 Maval Admin logged in successfully');
      } else {
        setError('Incorrect credentials. Username: admin | Password: admin123');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemoCredentials = () => {
    setUsername('admin');
    setPassword('admin123');
  };

  return (
    <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center p-4">
      {/* Back to website button */}
      <button
        onClick={() => setIsAdminView(false)}
        className="fixed top-6 left-6 inline-flex items-center gap-2 text-xs font-semibold text-stone-400 hover:text-stone-100 bg-stone-900 border border-stone-800 px-3.5 py-2 rounded-xl transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Website</span>
      </button>

      <div className="w-full max-w-md bg-stone-900/90 border border-stone-800 rounded-3xl p-8 shadow-2xl backdrop-blur-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-stone-950 mx-auto mb-4 shadow-lg shadow-amber-950/50">
            <Shield className="w-7 h-7 text-stone-950" />
          </div>
          <h2 className="font-heading text-2xl font-black text-stone-100">
            12 Maval CMS
          </h2>
          <p className="font-marathi text-xs text-amber-400 mt-1 font-semibold">
            अस्सल चुलीची खानदानी परंपरा • Admin Control Panel
          </p>
          <p className="text-xs text-stone-400 mt-2">
            Secure access to manage restaurant menu, dining tables, reservations & billing
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/50 flex items-center gap-2.5 text-xs text-red-300 mb-6">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1.5">
              Admin Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="admin-username-input"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full pl-10 pr-4 py-3 rounded-xl text-sm bg-stone-950 border border-stone-800 text-stone-100 placeholder:text-stone-600 focus:outline-hidden focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1.5">
              Admin Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="admin-password-input"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="admin123"
                className="w-full pl-10 pr-4 py-3 rounded-xl text-sm bg-stone-950 border border-stone-800 text-stone-100 placeholder:text-stone-600 focus:outline-hidden focus:border-amber-500"
              />
            </div>
          </div>

          {/* Quick Credentials Info / Auto-fill Box */}
          <div className="p-3 rounded-xl bg-stone-950/80 border border-amber-500/30 flex items-center justify-between text-xs">
            <div>
              <p className="text-stone-400 text-[11px]">Authorized Credentials:</p>
              <p className="font-mono text-stone-200 mt-0.5">
                User: <span className="text-amber-400 font-bold">admin</span> | Pass: <span className="text-amber-400 font-bold">admin123</span>
              </p>
            </div>
            <button
              type="button"
              onClick={handleFillDemoCredentials}
              className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 text-[11px] font-bold transition-colors"
            >
              Fill Credentials
            </button>
          </div>

          <button
            id="admin-login-submit"
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl text-sm font-bold text-stone-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-xl shadow-amber-950/50 disabled:opacity-50 transition-all active:scale-98"
          >
            {isLoading ? 'Verifying Access...' : 'Sign In to Admin Panel'}
          </button>
        </form>
      </div>
    </div>
  );
};
