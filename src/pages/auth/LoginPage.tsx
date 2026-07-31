import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Forgot Password Mode
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  const navigate = useNavigate();
  const { checkAuth } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      await api.post('/auth/login', { email, password });
      await checkAuth();
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const res = await api.post('/auth/forgot-password', { email: forgotEmail });
      setSuccessMsg(res.data.message || 'Password reset requested.');
      setIsForgotMode(false);
      setForgotEmail('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to request reset');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#03120B] p-4 text-[#FDFBF7]">
      <div className="w-full max-w-md bg-[#051a10] p-8 rounded-lg shadow-xl border border-white/5">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-light mb-2">MoneyTree<span className="text-[#D4AF37]">Fund</span></h1>
          <p className="text-sm text-gray-400">Trustee Management Platform</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-500/50 text-red-200 rounded text-sm">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 bg-green-900/50 border border-green-500/50 text-green-200 rounded text-sm">
            {successMsg}
          </div>
        )}

        {isForgotMode ? (
          <form onSubmit={handleForgotPassword} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Account Email</label>
              <input
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                required
                className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-colors"
              />
              <p className="text-xs text-gray-400 mt-2">
                We will notify an administrator to securely reset your password.
              </p>
            </div>

            <div className="space-y-3">
              <button
                type="submit"
                disabled={forgotLoading}
                className="w-full py-3 bg-[#D4AF37] hover:bg-[#b5952f] text-black font-medium rounded transition-colors disabled:opacity-50"
              >
                {forgotLoading ? 'Submitting...' : 'Request Password Reset'}
              </button>
              <button
                type="button"
                onClick={() => setIsForgotMode(false)}
                className="w-full py-3 bg-transparent text-gray-400 hover:text-white font-medium rounded transition-colors"
              >
                Back to Sign In
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-colors"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-300">Password</label>
                <button 
                  type="button"
                  onClick={() => setIsForgotMode(true)}
                  className="text-xs text-[#D4AF37] hover:underline focus:outline-none"
                >
                  Forgot Password?
                </button>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#D4AF37] hover:bg-[#b5952f] text-black font-medium rounded transition-colors disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        )}

        {!isForgotMode && (
          <div className="mt-6 text-center text-sm text-gray-400">
            Don't have an account? <Link to="/signup" className="text-[#D4AF37] hover:underline">Sign up</Link>
          </div>
        )}
      </div>
    </div>
  );
};
