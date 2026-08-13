import { Link } from 'react-router-dom';
import { Scissors, Zap, ArrowRight, Video, Sparkles, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';
import ThemeToggle from '../components/ThemeToggle';
import FullPageLoader from '../components/FullPageLoader';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <FullPageLoader />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans overflow-x-hidden">
      {/* Top Navigation */}
      <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div
            className="relative w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #a855f7)', boxShadow: '0 4px 14px rgba(124,58,237,0.45)' }}
          >
            <Scissors className="w-5 h-5 text-white" />
            <div className="absolute inset-0 rounded-xl"
              style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 60%)' }} />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-primary leading-none">ClipRank</span>
        </div>
        
        <div className="flex items-center gap-4 md:gap-6">
          <div className="hidden md:block">
            <ThemeToggle variant="icon-only" />
          </div>
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-white text-sm font-bold px-5 py-2.5 rounded-full shadow-lg hover:shadow-accent/40 transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-semibold text-muted hover:text-primary transition-colors"
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-white text-sm font-bold px-5 py-2.5 rounded-full shadow-lg hover:shadow-accent/40 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center relative pt-32 pb-20 px-4">
        {/* Decorative Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/4 w-[800px] h-[800px] bg-accent/10 rounded-full blur-[120px]" />
          <div className="absolute top-3/4 right-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px]" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '50px 50px',
            }}
          />
        </div>

        <div className="relative z-10 max-w-4xl w-full text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent font-semibold text-sm mb-4 shadow-[0_0_20px_rgba(124,58,237,0.15)]"
          >
            <Sparkles className="w-4 h-4" />
            <span>The #1 AI Video Repurposing Tool</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight text-primary leading-[1.1]"
          >
            Turn long videos into <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-purple-400">
              viral shorts
            </span> automatically.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-muted max-w-2xl mx-auto leading-relaxed"
          >
            ClipRank uses advanced AI to analyze, transcribe, and rank the most engaging moments from your YouTube, TikTok, or Instagram videos.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-accent to-purple-600 hover:from-accent-hover hover:to-purple-500 text-white text-lg font-bold px-8 py-4 rounded-full shadow-[0_4px_24px_rgba(124,58,237,0.4)] transition-all duration-300 transform hover:scale-105"
              >
                Go to Dashboard
                <ArrowRight className="w-5 h-5" />
              </Link>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-accent to-purple-600 hover:from-accent-hover hover:to-purple-500 text-white text-lg font-bold px-8 py-4 rounded-full shadow-[0_4px_24px_rgba(124,58,237,0.4)] transition-all duration-300 transform hover:scale-105"
                >
                  Start Clipping Free
                  <Zap className="w-5 h-5" />
                </Link>
                <Link
                  to="/login"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-surface/50 hover:bg-surface border border-border text-primary text-lg font-bold px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105"
                >
                  <LogIn className="w-5 h-5" />
                  Sign in to Dashboard
                </Link>
              </>
            )}
          </motion.div>
        </div>

        {/* Feature Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto w-full mt-24 px-4"
        >
          {[
            { icon: Video, title: 'Multi-Platform', desc: 'Paste links from YouTube, TikTok, or Instagram instantly.' },
            { icon: Zap, title: 'AI Ranking', desc: 'Our algorithm finds the most engaging hooks and moments.' },
            { icon: Scissors, title: 'Auto-Clipping', desc: 'Get perfectly trimmed vertical clips ready for upload.' },
          ].map((feature, i) => (
            <div key={i} className="bg-card/40 backdrop-blur-sm border border-border/50 p-6 rounded-2xl hover:bg-card/60 transition-colors">
              <div className="w-12 h-12 bg-accent/15 rounded-xl flex items-center justify-center mb-4 text-accent">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-2">{feature.title}</h3>
              <p className="text-muted">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted">© {new Date().getFullYear()} ClipRank. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy-policy" className="text-sm text-muted hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <a href="mailto:support@cliprank.app" className="text-sm text-muted hover:text-primary transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
