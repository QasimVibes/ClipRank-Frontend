import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Link2, Sparkles, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { YouTubeIcon, InstagramIcon, TikTokIcon } from '../components/PlatformIcon';
import { submitVideo } from '../api';

const PLATFORMS = [
  { name: 'YouTube', icon: YouTubeIcon, color: '#FF0000', hint: 'youtube.com' },
  { name: 'Instagram', icon: InstagramIcon, color: '#E1306C', hint: 'instagram.com' },
  { name: 'TikTok', icon: TikTokIcon, color: '#ffffff', hint: 'tiktok.com' },
];

const EXAMPLE_URLS = [
  'https://youtu.be/7uRyqg2NT-k?si=Dg0M7jEztNMkRUk4',
  'https://www.tiktok.com/@toop5_/video/7578945803910270230?is_from_webapp=1&sender_device=pc',
  'https://www.instagram.com/reel/DS6UuBlEx2o/?utm_source=ig_web_button_share_sheet',
];

const ALLOWED_DOMAINS = [
  'youtube.com',
  'youtu.be',
  'instagram.com',
  'instagr.am',
  'tiktok.com',
];

function isValidUrl(url) {
  try {
    const u = new URL(url.trim());
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return false;
    const hostname = u.hostname.toLowerCase();
    return ALLOWED_DOMAINS.some((domain) => hostname === domain || hostname.endsWith('.' + domain));
  } catch {
    return false;
  }
}

export default function Submit() {
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!url.trim()) {
      setError('Please paste a video URL to continue.');
      return;
    }
    if (!isValidUrl(url)) {
      setError('Only YouTube, Instagram, and TikTok video URLs are supported.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const res = await submitVideo(url);
      navigate(`/processing/${res.video_id}`);
    } catch (err) {
      setError(err.message || 'Failed to submit video');
      setIsLoading(false);
    }
  };

  const handleExampleClick = (exUrl) => {
    setUrl(exUrl);
    setError('');
  };

  const detectedPlatform = PLATFORMS.find((p) => {
    const u = url.toLowerCase();
    if (p.name === 'YouTube') return u.includes('youtube.com') || u.includes('youtu.be');
    if (p.name === 'Instagram') return u.includes('instagram.com') || u.includes('instagr.am');
    if (p.name === 'TikTok') return u.includes('tiktok.com');
    return false;
  });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-[80px]" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      <motion.div
        className="relative z-10 w-full max-w-3xl flex flex-col items-center text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header Area */}
        <div className="flex flex-col items-center gap-6 mb-12">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-2 bg-accent/15 border border-accent/30 text-accent-light px-5 py-2 rounded-full text-sm font-semibold tracking-wide"
          >
            <Sparkles className="w-4 h-4" />
            AI-Powered Video Clipping
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="space-y-6"
          >
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
              <span className="gradient-text drop-shadow-sm">Clip the best moments,</span>
              <br />
              <span className="accent-gradient-text drop-shadow-sm">automatically.</span>
            </h1>
            <p className="text-muted text-lg md:text-xl max-w-xl mx-auto leading-relaxed">
              Paste a link. Our AI transcribes, ranks, and clips the top moments for you — in seconds.
            </p>
          </motion.div>
        </div>

        {/* Input form */}
        <motion.div
          className="w-full max-w-2xl flex flex-col gap-6"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <form onSubmit={handleSubmit} className="w-full relative group">
            {/* Platform indicator */}
            {detectedPlatform && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute left-5 top-0 bottom-0 flex items-center justify-center pointer-events-none z-10"
              >
                <detectedPlatform.icon
                  className="w-6 h-6"
                  style={{ color: detectedPlatform.color }}
                />
              </motion.div>
            )}
            {!detectedPlatform && (
              <div className="absolute left-5 top-0 bottom-0 flex items-center justify-center pointer-events-none z-10">
                <Link2 className="w-6 h-6 text-muted" />
              </div>
            )}

            <input
              id="video-url-input"
              type="url"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setError('');
              }}
              placeholder="Paste a YouTube, Instagram, or TikTok URL..."
              className={`
                w-full bg-surface/90 backdrop-blur-md border text-primary placeholder-muted
                pl-14 pr-44 py-5 rounded-2xl text-base transition-all duration-300 shadow-xl
                focus:outline-none focus:ring-2 focus:ring-accent/40 focus:bg-surface
                ${error ? 'border-danger/60 focus:border-danger' : 'border-border/50 hover:border-accent/40 focus:border-accent'}
              `}
              autoFocus
            />

            <button
              type="submit"
              disabled={isLoading}
              id="rank-and-clip-btn"
              className={`
                absolute right-2.5 top-1/2 -translate-y-1/2
                flex items-center gap-2 bg-accent hover:bg-accent-hover text-white
                font-bold px-7 py-3 rounded-xl text-sm shadow-md
                transition-all duration-300 hover:scale-105 active:scale-95
                disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100
              `}
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Rank &amp; Clip
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-danger text-sm text-left px-2"
            >
              {error}
            </motion.p>
          )}

          {/* Example URLs */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="w-full flex flex-col items-center gap-4 pt-4"
          >
            <p className="text-sm text-muted font-medium">Or try an example:</p>
            <div className="flex flex-wrap gap-3 justify-center">
              {EXAMPLE_URLS.map((exUrl) => {
                const isYouTube = exUrl.includes('youtube');
                const isInstagram = exUrl.includes('instagram');
                const isTikTok = exUrl.includes('tiktok');

                let Icon = Link2;
                if (isYouTube) Icon = YouTubeIcon;
                else if (isInstagram) Icon = InstagramIcon;
                else if (isTikTok) Icon = TikTokIcon;

                return (
                  <button
                    key={exUrl}
                    onClick={() => handleExampleClick(exUrl)}
                    className="flex items-center justify-center gap-2 text-sm font-medium bg-surface/50 hover:bg-card border border-border/50 hover:border-accent/50 text-muted hover:text-primary px-5 py-2.5 rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                  >
                    <span className="flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" />
                    </span>
                    <span className="truncate">{exUrl.replace('https://', '').replace('www.', '').split('/')[0]}</span>
                  </button>
                )
              })}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
