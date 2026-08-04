import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Clock, Scissors, ExternalLink, Plus, ChevronRight,
  CheckCircle2, Loader2, AlertCircle, Circle
} from 'lucide-react';
import RankBadge from '../components/RankBadge';
import { listVideos } from '../api';

const STATUS_STEPS = ['queued', 'downloading', 'transcribing', 'ranking', 'analyzing', 'clipping', 'done'];


const PLATFORM_COLORS = {
  YouTube: '#FF0000',
  Instagram: '#E1306C',
  TikTok: '#ffffff',
};

const PLATFORM_BG = {
  YouTube: 'bg-red-500/10 text-red-400 border-red-500/20',
  Instagram: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  TikTok: 'bg-zinc-500/10 text-zinc-300 border-zinc-500/20',
};

function StatusBadge({ status }) {
  const styles = {
    done: { color: 'bg-success/15 text-success border-success/30', icon: CheckCircle2, label: 'Done' },
    clipping: { color: 'bg-accent/15 text-accent-light border-accent/30', icon: Loader2, label: 'Clipping', spin: true },
    transcribing: { color: 'bg-warning/15 text-warning border-warning/30', icon: Loader2, label: 'Transcribing', spin: true },
    queued: { color: 'bg-zinc-700/30 text-muted border-border', icon: Circle, label: 'Queued' },
    error: { color: 'bg-danger/15 text-danger border-danger/30', icon: AlertCircle, label: 'Error' },
  };
  const cfg = styles[status] || styles.queued;
  const Icon = cfg.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.color}`}>
      <Icon className={`w-3 h-3 ${cfg.spin ? 'animate-spin' : ''}`} />
      {cfg.label}
    </span>
  );
}

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function detectPlatformAndThumbnail(urlStr) {
  const u = (urlStr || '').toLowerCase();
  let platform = null;
  let thumbnail = null;

  if (u.includes('youtube.com') || u.includes('youtu.be')) {
    platform = 'YouTube';
    const ytMatch = (urlStr || '').match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([^&?\/\n]+)/);
    if (ytMatch && ytMatch[1]) {
      thumbnail = `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`;
    }
  } else if (u.includes('instagram.com') || u.includes('instagr.am')) {
    platform = 'Instagram';
  } else if (u.includes('tiktok.com')) {
    platform = 'TikTok';
  }

  return { platform, thumbnail };
}

export default function History() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await listVideos(1, 50);
        const mapped = data.items.map(job => {
          const u = job.url || '';
          const { platform, thumbnail } = detectPlatformAndThumbnail(u);

          return {
            id: job._id,
            url: u,
            platform,
            title: job.title || 'Untitled Video',
            submittedAt: job.created_at,
            status: job.status,
            clipCount: job.clipCount || 0,
            topScore: null,
            thumbnail,
          };
        });
        setJobs(mapped);
      } catch (err) {
        console.error('Failed to load history', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="min-h-screen px-4 py-8 md:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold text-primary">History</h1>
            <p className="text-sm text-muted mt-1">
              All your past video submissions and generated clips.
            </p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
            id="new-submission-btn"
          >
            <Plus className="w-4 h-4" />
            New Video
          </button>
        </motion.div>

        {/* Summary row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-6 px-4 py-3 glass-card"
        >
          <div className="text-center">
            <div className="text-xl font-bold text-primary">{jobs.length}</div>
            <div className="text-[11px] text-muted">Videos</div>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="text-center">
            <div className="text-xl font-bold text-primary">
              {jobs.reduce((s, j) => s + (j.clipCount || 0), 0)}
            </div>
            <div className="text-[11px] text-muted">Total Clips</div>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="text-center">
            <div className="text-xl font-bold text-success">
              {jobs.filter((j) => j.status === 'done').length}
            </div>
            <div className="text-[11px] text-muted">Completed</div>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="text-center">
            <div className="text-xl font-bold text-accent-light">
              {jobs.reduce((max, j) => j.topScore ? Math.max(max, j.topScore) : max, 0)}
            </div>
            <div className="text-[11px] text-muted">Best Score</div>
          </div>
        </motion.div>

        {/* Job list */}
        <div className="space-y-3">
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center items-center py-24"
            >
              <Loader2 className="w-8 h-8 text-accent animate-spin" />
            </motion.div>
          ) : jobs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24"
            >
              <div className="text-5xl mb-4">🎬</div>
              <h3 className="text-lg font-semibold text-primary mb-2">No submissions yet</h3>
              <p className="text-muted text-sm mb-6">Submit your first video to get started.</p>
              <button onClick={() => navigate('/')} className="btn-primary" id="first-submit-btn">
                Submit a Video
                <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          ) : (
            jobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06, duration: 0.3 }}
                onClick={() => job.status === 'done' && navigate(`/gallery/${job.id}`)}
                className={`
                  glass-card overflow-hidden transition-all duration-200 group
                  ${job.status === 'done'
                    ? 'cursor-pointer hover:border-accent/30 hover:shadow-card-hover'
                    : 'cursor-default'}
                `}
                id={`history-job-${job.id}`}
              >
                <div className="flex items-center gap-4 p-4">
                  {/* Thumbnail */}
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden flex-shrink-0 bg-zinc-900">
                    {job.thumbnail && (
                      <img
                        src={job.thumbnail}
                        alt={job.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    {/* Clip count badge */}
                    {job.clipCount && (
                      <div className="absolute bottom-1 right-1 flex items-center gap-0.5 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                        <Scissors className="w-2.5 h-2.5" />
                        {job.clipCount}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      {job.platform && (
                        <span className={`badge border text-[10px] ${PLATFORM_BG[job.platform] || 'bg-card text-muted border-border'}`}>
                          {job.platform}
                        </span>
                      )}
                      <StatusBadge status={job.status} />
                    </div>

                    <p className="text-sm font-semibold text-primary line-clamp-1">{job.title}</p>

                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="flex items-center gap-1 text-xs text-muted">
                        <Clock className="w-3 h-3" />
                        {formatDate(job.submittedAt)}
                      </div>
                      <a
                        href={job.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1 text-xs text-muted hover:text-accent transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Source
                      </a>
                    </div>
                  </div>

                  {/* Right side */}
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    {job.topScore && (
                      <RankBadge score={job.topScore} size="sm" />
                    )}
                    {job.status === 'done' && (
                      <div className="flex items-center gap-1 text-xs text-muted group-hover:text-accent-light transition-colors">
                        View clips
                        <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    )}
                    {job.status !== 'done' && (
                      <button
                        onClick={(e) => { e.stopPropagation(); navigate(`/processing/${job.id}`); }}
                        className="text-xs text-accent hover:text-accent-light transition-colors"
                        id={`view-processing-${job.id}`}
                      >
                        View progress →
                      </button>
                    )}
                  </div>
                </div>

                {/* Processing progress bar for in-progress jobs */}
                {job.status !== 'done' && job.status !== 'error' && (
                  <div className="px-4 pb-3">
                    <div className="flex items-center gap-2">
                      {STATUS_STEPS.map((step, i) => {
                        const currentIdx = STATUS_STEPS.indexOf(job.status);
                        const isDone = i < currentIdx;
                        const isActive = i === currentIdx;
                        return (
                          <div
                            key={step}
                            className={`
                              flex-1 h-1 rounded-full transition-all duration-300
                              ${isDone ? 'bg-success' : isActive ? 'bg-accent animate-pulse' : 'bg-border'}
                            `}
                          />
                        );
                      })}
                    </div>
                    <p className="text-[10px] text-muted mt-1 capitalize">{job.status}...</p>
                  </div>
                )}
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
