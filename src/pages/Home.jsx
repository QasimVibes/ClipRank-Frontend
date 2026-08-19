import { Link } from 'react-router-dom';
import {
  Scissors, Zap, ArrowRight, Video, Sparkles, LogIn,
  CheckCircle, Users, BarChart3, Clock, Star, ChevronDown, ChevronUp,
  PlayCircle, TrendingUp, Shield, Cpu
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import ThemeToggle from '../components/ThemeToggle';
import { useAuth } from '../context/AuthContext';

// SSR-safe: when isLoading is true (server or first hydration), render full
// page content instead of a spinner so Google crawler sees real HTML.
export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const [openFaq, setOpenFaq] = useState(null);

  // NOTE: We intentionally do NOT show FullPageLoader here.
  // On SSR, isLoading=true (useEffect never runs on server) — showing a loader
  // would give Google an empty page. The nav/CTA adjust once hydration completes.

  const stats = [
    { value: '2M+', label: 'Videos Processed', icon: Video },
    { value: '50K+', label: 'Creators Using ClipRank', icon: Users },
    { value: '18M+', label: 'Clips Generated', icon: Scissors },
    { value: '98%', label: 'Satisfaction Rate', icon: Star },
  ];

  const steps = [
    {
      step: '01',
      icon: PlayCircle,
      title: 'Paste Your Video Link',
      desc: 'Drop any YouTube, TikTok, or Instagram URL into ClipRank. No downloads or uploads required.',
    },
    {
      step: '02',
      icon: Cpu,
      title: 'AI Analyzes & Ranks Moments',
      desc: 'Our AI transcribes the audio, detects viral hooks, emotional peaks, and high-engagement moments — then ranks them by virality score.',
    },
    {
      step: '03',
      icon: TrendingUp,
      title: 'Download Ready-to-Post Clips',
      desc: 'Get perfectly trimmed vertical short-form clips with captions, ready to post on TikTok, Reels, or YouTube Shorts.',
    },
  ];

  const features = [
    {
      icon: Video,
      title: 'Multi-Platform',
      desc: 'Paste links from YouTube, TikTok, or Instagram — ClipRank handles all major video platforms instantly.',
    },
    {
      icon: Zap,
      title: 'AI Virality Ranking',
      desc: 'Our proprietary algorithm detects the most engaging hooks, emotional moments, and high-retention segments.',
    },
    {
      icon: Scissors,
      title: 'Auto-Clipping',
      desc: 'Get perfectly trimmed vertical 9:16 clips automatically optimized for short-form platforms.',
    },
    {
      icon: Shield,
      title: 'Privacy First',
      desc: 'We never store your videos. Content is processed in-memory and deleted immediately after clip generation.',
    },
    {
      icon: Clock,
      title: 'Lightning Fast',
      desc: 'From URL to downloadable clips in under 3 minutes — no editing skills required.',
    },
    {
      icon: BarChart3,
      title: 'Virality Score',
      desc: 'Every clip gets a detailed virality score breakdown so you know exactly which moment will perform best.',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      handle: '@sarahcreates',
      avatar: 'SC',
      role: 'YouTube Creator · 1.2M subs',
      quote: 'ClipRank saved me 8 hours a week. I used to manually scrub through 2-hour podcasts — now I just paste the link and get the best clips in minutes.',
      stars: 5,
    },
    {
      name: 'Marcus Rivera',
      handle: '@marcusfit',
      avatar: 'MR',
      role: 'Fitness Coach · TikTok Creator',
      quote: 'My TikTok views tripled in a month. The AI finds the exact moment that hooks people — it\'s genuinely scary how accurate it is.',
      stars: 5,
    },
    {
      name: 'Priya Patel',
      handle: '@priyatech',
      avatar: 'PP',
      role: 'Tech Influencer · Instagram',
      quote: 'I run a media agency and we use ClipRank for all our clients. The time savings are insane — 10x faster than manual editing.',
      stars: 5,
    },
  ];

  const faqs = [
    {
      q: 'What platforms does ClipRank support?',
      a: 'ClipRank currently supports YouTube, TikTok, and Instagram (Reels & posts). We are actively working on adding Twitch, X (Twitter), and podcast platforms.',
    },
    {
      q: 'How does the AI know which moments are "viral"?',
      a: 'Our AI model is trained on millions of short-form videos and their engagement metrics. It analyzes speech patterns, sentiment, pacing, topic relevance, and audio energy to predict which segments will hold viewer attention on short-form platforms.',
    },
    {
      q: 'Does ClipRank store my videos?',
      a: 'No. We process video content in-memory only. Nothing is permanently stored on our servers. After your clips are generated, all temporary data is deleted immediately.',
    },
    {
      q: 'Is ClipRank free to use?',
      a: 'ClipRank offers a free tier with a limited number of clips per month. Premium plans unlock unlimited clips, higher quality exports, and priority processing.',
    },
    {
      q: 'How long does it take to generate clips?',
      a: 'Most videos are processed in 2–4 minutes depending on length. A 1-hour video typically takes about 3 minutes. You will receive a notification when your clips are ready.',
    },
    {
      q: 'Can I use ClipRank for my clients (agency use)?',
      a: 'Yes! Many agencies and social media managers use ClipRank at scale. Our Business plan includes team seats, bulk processing, and white-label export options.',
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans overflow-x-hidden">

      {/* ── Top Navigation ── */}
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
          {!isLoading && isAuthenticated ? (
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

      <main className="flex-1 flex flex-col">

        {/* ── Hero Section ── */}
        <section className="flex flex-col items-center justify-center relative pt-36 pb-24 px-4">
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
              Turn long videos into{' '}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-purple-400">
                viral shorts
              </span>{' '}
              automatically.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-muted max-w-2xl mx-auto leading-relaxed"
            >
              ClipRank uses advanced AI to analyze, transcribe, and rank the most engaging moments from your YouTube, TikTok, or Instagram videos — then auto-generates perfectly trimmed vertical clips ready for posting.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            >
              {!isLoading && isAuthenticated ? (
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

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap items-center justify-center gap-6 pt-4 text-sm text-muted"
            >
              {['No credit card required', 'Free tier available', 'Cancel anytime'].map((badge) => (
                <span key={badge} className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  {badge}
                </span>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── Stats Section ── */}
        <section className="py-16 px-4 border-y border-border/50 bg-card/20">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * i }}
                className="text-center"
              >
                <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-3 text-accent">
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="text-3xl md:text-4xl font-extrabold text-primary mb-1">{stat.value}</div>
                <div className="text-sm text-muted">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── How It Works ── */}
        <section className="py-24 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-semibold mb-4">
                <Zap className="w-3.5 h-3.5" /> How It Works
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-primary mt-3 mb-4">
                From URL to viral clip in{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-purple-400">
                  3 simple steps
                </span>
              </h2>
              <p className="text-muted text-lg max-w-2xl mx-auto">
                No video editing skills needed. ClipRank does all the heavy lifting so you can focus on creating.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {steps.map((step, i) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.15 * i }}
                  className="relative flex flex-col items-center text-center group"
                >
                  <div className="relative mb-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-accent/20 to-purple-600/20 rounded-3xl flex items-center justify-center border border-accent/20 group-hover:border-accent/50 transition-colors duration-300">
                      <step.icon className="w-10 h-10 text-accent" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-7 h-7 bg-accent rounded-full flex items-center justify-center text-white text-xs font-black">
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-3">{step.title}</h3>
                  <p className="text-muted leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Features Grid ── */}
        <section className="py-24 px-4 bg-card/20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-semibold mb-4">
                <Sparkles className="w-3.5 h-3.5" /> Features
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-primary mt-3 mb-4">
                Everything you need to go viral
              </h2>
              <p className="text-muted text-lg max-w-2xl mx-auto">
                ClipRank is purpose-built for creators who want to grow faster on short-form platforms without spending hours editing.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.08 * i }}
                  className="bg-card/40 backdrop-blur-sm border border-border/50 p-6 rounded-2xl hover:bg-card/70 hover:border-accent/30 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 bg-accent/15 rounded-xl flex items-center justify-center mb-4 text-accent group-hover:bg-accent/25 transition-colors duration-300">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-2">{feature.title}</h3>
                  <p className="text-muted leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Testimonials ── */}
        <section className="py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-semibold mb-4">
                <Star className="w-3.5 h-3.5" /> Testimonials
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-primary mt-3 mb-4">
                Loved by creators worldwide
              </h2>
              <p className="text-muted text-lg max-w-2xl mx-auto">
                Join over 50,000 creators who use ClipRank to grow their audience faster.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <motion.div
                  key={t.handle}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.12 * i }}
                  className="bg-card/40 backdrop-blur-sm border border-border/50 p-6 rounded-2xl flex flex-col gap-4 hover:border-accent/20 transition-colors duration-300"
                >
                  {/* Stars */}
                  <div className="flex gap-1">
                    {Array.from({ length: t.stars }).map((_, si) => (
                      <Star key={si} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-primary/90 leading-relaxed flex-1">&ldquo;{t.quote}&rdquo;</p>
                  <div className="flex items-center gap-3 pt-2 border-t border-border/50">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg, #7C3AED, #a855f7)' }}
                    >
                      {t.avatar}
                    </div>
                    <div>
                      <div className="font-bold text-primary text-sm">{t.name}</div>
                      <div className="text-xs text-muted">{t.role}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ Section ── */}
        <section className="py-24 px-4 bg-card/20">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-semibold mb-4">
                FAQ
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-primary mt-3 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-muted text-lg">Everything you need to know about ClipRank.</p>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.07 * i }}
                  className="bg-card/40 border border-border/50 rounded-2xl overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-card/60 transition-colors duration-200"
                    aria-expanded={openFaq === i}
                  >
                    <span className="font-semibold text-primary">{faq.q}</span>
                    {openFaq === i
                      ? <ChevronUp className="w-5 h-5 text-accent flex-shrink-0" />
                      : <ChevronDown className="w-5 h-5 text-muted flex-shrink-0" />
                    }
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-5 text-muted leading-relaxed border-t border-border/30 pt-4">
                      {faq.a}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA Banner ── */}
        <section className="py-24 px-4 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-purple-600/10" />
          </div>
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-extrabold text-primary mb-6">
              Start turning long videos into{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-purple-400">
                viral shorts
              </span>{' '}
              today.
            </h2>
            <p className="text-muted text-lg mb-10 max-w-xl mx-auto">
              Join 50,000+ creators already using ClipRank. Free tier available — no credit card required.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/signup"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-accent to-purple-600 hover:from-accent-hover hover:to-purple-500 text-white text-lg font-bold px-10 py-4 rounded-full shadow-[0_4px_24px_rgba(124,58,237,0.4)] transition-all duration-300 transform hover:scale-105"
              >
                Get Started Free
                <Zap className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-border bg-card/30 mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #7C3AED, #a855f7)' }}
            >
              <Scissors className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-primary">ClipRank</span>
          </div>
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
