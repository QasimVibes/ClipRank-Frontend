import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, Scissors, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed'); ``
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/">
            <div
              className="inline-flex w-14 h-14 rounded-2xl items-center justify-center mb-4"
              style={{ background: 'linear-gradient(135deg, #7C3AED, #a855f7)', boxShadow: '0 4px 20px rgba(124,58,237,0.4)' }}
            >
              <Scissors className="w-7 h-7 text-white" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-primary">Welcome back</h1>
          <p className="text-muted text-sm mt-1">Sign in to your ClipRank account</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
          {error && (
            <div className="px-4 py-3 rounded-xl bg-danger/10 border border-danger/20 text-danger text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-xs font-medium text-muted mb-1.5">Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input-field pl-10"
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-medium text-muted mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field pl-10"
                required
                autoComplete="current-password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full justify-center py-3 mt-2"
          >
            {isLoading ? (
              <span className="animate-pulse">Signing in…</span>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                Sign in
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-muted mt-6">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="text-accent-light hover:text-accent font-medium transition-colors">
            Create one
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
