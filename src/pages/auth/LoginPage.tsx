import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle2, ArrowRight, RotateCcw } from 'lucide-react';

// Map Firebase/backend error codes to friendly messages
const friendlyError = (msg: string): string => {
  if (!msg) return 'Something went wrong. Please try again.';
  const m = msg.toLowerCase();
  if (m.includes('invalid_login_credentials') || m.includes('invalid login') || m.includes('email_not_found') || m.includes('wrong_password'))
    return 'Incorrect email or password. Please try again.';
  if (m.includes('too_many_attempts') || m.includes('too many'))
    return 'Too many failed attempts. Please wait a few minutes and try again.';
  if (m.includes('user_disabled'))
    return 'Your account has been disabled. Please contact support.';
  if (m.includes('network') || m.includes('fetch'))
    return 'Network error. Please check your connection and try again.';
  if (m.includes('api key'))
    return 'Server configuration error. Please contact support.';
  return msg;
};

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [shaking, setShaking] = useState(false);

  const [isForgotMode, setIsForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  const navigate = useNavigate();
  const { checkAuth } = useAuth();

  const triggerShake = () => {
    setShaking(true);
    setTimeout(() => setShaking(false), 600);
  };

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
      const raw = err.response?.data?.message || err.message || '';
      setError(friendlyError(raw));
      triggerShake();
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
      setSuccessMsg(res.data.message || 'Reset request submitted.');
      setIsForgotMode(false);
      setForgotEmail('');
    } catch (err: any) {
      const raw = err.response?.data?.message || err.message || '';
      setError(friendlyError(raw));
      triggerShake();
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#03120B] p-4 text-[#FDFBF7] relative overflow-hidden font-sans">
      {/* Ambient glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#D4AF37]/8 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#0A2A1B]/60 blur-[120px] rounded-full pointer-events-none" />

      <div
        className={`w-full max-w-md relative z-10 animate-fade-in-up ${shaking ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}
        style={shaking ? { animation: 'shake 0.5s ease-in-out' } : {}}
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-serif mb-2">
            MoneyTree<span className="text-gradient-gold">Fund</span>
          </h1>
          <p className="text-sm text-gray-500 uppercase tracking-widest font-medium">Trustee Management Platform</p>
        </div>

        {/* Card */}
        <div className="bg-[#05140d] border border-white/10 rounded-3xl p-8 shadow-[0_30px_80px_rgba(0,0,0,0.6)]">

          {/* Error Banner */}
          {error && (
            <div className="mb-6 flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/25 rounded-2xl animate-fade-in-up">
              <AlertCircle size={18} className="text-red-400 mt-0.5 shrink-0" />
              <p className="text-sm text-red-300 leading-relaxed">{error}</p>
            </div>
          )}

          {/* Success Banner */}
          {successMsg && (
            <div className="mb-6 flex items-start gap-3 p-4 bg-green-500/10 border border-green-500/25 rounded-2xl animate-fade-in-up">
              <CheckCircle2 size={18} className="text-green-400 mt-0.5 shrink-0" />
              <p className="text-sm text-green-300 leading-relaxed">{successMsg}</p>
            </div>
          )}

          {isForgotMode ? (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-serif text-white mb-1">Reset Password</h2>
                <p className="text-sm text-gray-500">An administrator will be notified to reset your access.</p>
              </div>

              <form onSubmit={handleForgotPassword} className="space-y-5">
                <div>
                  <label className="block text-xs text-gray-400 mb-2 uppercase tracking-widest font-medium">Account Email</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      required
                      placeholder="you@example.com"
                      className="w-full pl-11 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#D4AF37]/60 focus:ring-1 focus:ring-[#D4AF37]/30 transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full py-3.5 bg-[#D4AF37] hover:bg-[#FCEBBA] text-black font-semibold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {forgotLoading ? (
                    <><RotateCcw size={16} className="animate-spin" /> Submitting...</>
                  ) : (
                    <><ArrowRight size={16} /> Request Reset</>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => { setIsForgotMode(false); setError(''); }}
                  className="w-full py-3 text-gray-400 hover:text-white text-sm font-medium transition-colors"
                >
                  ← Back to Sign In
                </button>
              </form>
            </>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-serif text-white mb-1">Welcome back</h2>
                <p className="text-sm text-gray-500">Sign in to access your secure portal.</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-xs text-gray-400 mb-2 uppercase tracking-widest font-medium">Email</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(''); }}
                      required
                      autoComplete="email"
                      placeholder="you@example.com"
                      className="w-full pl-11 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#D4AF37]/60 focus:ring-1 focus:ring-[#D4AF37]/30 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs text-gray-400 uppercase tracking-widest font-medium">Password</label>
                    <button
                      type="button"
                      onClick={() => setIsForgotMode(true)}
                      className="text-xs text-[#D4AF37] hover:text-[#FCEBBA] transition-colors"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(''); }}
                      required
                      autoComplete="current-password"
                      placeholder="••••••••••"
                      className="w-full pl-11 pr-12 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-[#D4AF37]/60 focus:ring-1 focus:ring-[#D4AF37]/30 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-[#D4AF37] hover:bg-[#FCEBBA] text-black font-semibold rounded-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
                >
                  {loading ? (
                    <><RotateCcw size={16} className="animate-spin" /> Authenticating...</>
                  ) : (
                    <>Sign In <ArrowRight size={16} /></>
                  )}
                </button>
              </form>
            </>
          )}
        </div>

        {!isForgotMode && (
          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[#D4AF37] hover:text-[#FCEBBA] transition-colors">
              Sign up
            </Link>
          </p>
        )}
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          15% { transform: translateX(-8px); }
          30% { transform: translateX(8px); }
          45% { transform: translateX(-6px); }
          60% { transform: translateX(6px); }
          75% { transform: translateX(-4px); }
          90% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  );
};
