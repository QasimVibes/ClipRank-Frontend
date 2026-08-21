import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Clock, Scissors, ExternalLink, Plus, ChevronRight,
  CheckCircle2, Loader2, AlertCircle, Circle,
  Download, FileText, BarChart2, Zap, RefreshCw, Trash2
} from 'lucide-react';
import RankBadge from '../components/RankBadge';
import { listVideos, deleteVideo } from '../api';

const STATUS_STEPS = ['queued', 'downloading', 'transcribing', 'ranking', 'analyzing', 'clipping', 'done'];


const PLATFORM_BG = {
  YouTube: 'bg-red-500/10 text-red-400 border-red-500/20',
  Instagram: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  TikTok: 'bg-zinc-500/10 text-zinc-300 border-zinc-500/20',
};

function StatusBadge({ status }) {
  const styles = {
    done:        { color: 'bg-success/15 text-success border-success/30',           icon: CheckCircle2, label: 'Done' },
    queued:      { color: 'bg-zinc-700/30 text-muted border-border',                icon: Circle,      label: 'Queued' },
    downloading: { color: 'bg-blue-500/15 text-blue-400 border-blue-500/30',        icon: Download,    label: 'Downloading', spin: false },
    transcribing:{ color: 'bg-warning/15 text-warning border-warning/30',           icon: FileText,    label: 'Transcribing', spin: false },
    ranking:     { color: 'bg-purple-500/15 text-purple-400 border-purple-500/30',  icon: BarChart2,   label: 'Ranking', spin: false },
    analyzing:   { color: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',        icon: Zap,         label: 'Analyzing', spin: false },
    clipping:    { color: 'bg-accent/15 text-accent-light border-accent/30',        icon: Scissors,    label: 'Clipping', spin: false },
    error:       { color: 'bg-danger/15 text-danger border-danger/30',              icon: AlertCircle, label: 'Error' },
    failed:      { color: 'bg-danger/15 text-danger border-danger/30',              icon: AlertCircle, label: 'Failed' },
  };
  const cfg = styles[status] || styles.queued;
  const Icon = cfg.icon;
  // Active processing statuses get a pulsing ring instead of a spinning icon
  const isProcessing = !['done', 'queued', 'error', 'failed'].includes(status);

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.color}`}>
      <span className={`relative flex items-center justify-center`}>
        {isProcessing && (
          <span className="absolute inline-flex w-full h-full rounded-full opacity-60 animate-ping" style={{ background: 'currentColor' }} />
        )}
        <Icon className={`w-3 h-3 relative`} />
      </span>
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

const TERMINAL_STATUSES = new Set(['done', 'error', 'failed']);
const POLL_INTERVAL_MS = 5000;

export default function History() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const pollTimerRef = useRef(null);

  const mapJobs = useCallback((items) =>
    items.map(job => {
      const u = job.url || job.source_url || '';
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
    }),
  []);

  const fetchJobs = useCallback(async (isBackground = false) => {
    try {
      if (!isBackground) setLoading(true);
      else setIsRefreshing(true);

      const data = await listVideos(1, 50);
      const mapped = mapJobs(data.items);
      setJobs(mapped);

      // If any job is still in progress, schedule a poll
      const hasActiveJobs = mapped.some(j => !TERMINAL_STATUSES.has(j.status));
      if (hasActiveJobs) {
        if (pollTimerRef.current) clearTimeout(pollTimerRef.current);
        pollTimerRef.current = setTimeout(() => fetchJobs(true), POLL_INTERVAL_MS);
      } else {
        // All done — stop polling
        if (pollTimerRef.current) {
          clearTimeout(pollTimerRef.current);
          pollTimerRef.current = null;
        }
      }
    } catch (err) {
      console.error('Failed to load history', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [mapJobs]);

  useEffect(() => {
    fetchJobs();
    return () => {
      if (pollTimerRef.current) clearTimeout(pollTimerRef.current);
    };
  }, [fetchJobs]);

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
          <div className="flex items-center gap-2">
            {isRefreshing && (
              <span className="flex items-center gap-1.5 text-xs text-muted">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Updating...
              </span>
            )}
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-primary"
              id="new-submission-btn"
            >
              <Plus className="w-4 h-4" />
              New Video
            </button>
          </div>
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
              <button onClick={() => navigate('/dashboard')} className="btn-primary" id="first-submit-btn">
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

                  {/* Right side Actions */}
                  <div className="flex items-center gap-3 flex-shrink-0 ml-auto pl-2">
                    
                    {/* Scores / Progress */}
                    <div className="flex flex-col items-end gap-1.5">
                      {job.topScore && (
                        <RankBadge score={job.topScore} size="sm" />
                      )}
                      {job.status !== 'done' && (
                        <button
                          onClick={(e) => { e.stopPropagation(); navigate(`/processing/${job.id}`); }}
                          className="text-[10px] uppercase tracking-wider font-bold text-accent hover:text-accent-light transition-colors"
                          id={`view-processing-${job.id}`}
                        >
                          Progress →
                        </button>
                      )}
                    </div>

                    <div className="w-px h-8 bg-border/60 hidden sm:block mx-1" />

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      {job.status === 'done' && (
                        <div className="flex items-center justify-center gap-1 px-3 py-2 rounded-xl bg-accent/10 text-accent text-xs font-semibold border border-accent/20 group-hover:bg-accent group-hover:text-white group-hover:shadow-[0_2px_10px_rgba(124,58,237,0.3)] transition-all duration-300">
                          <span className="hidden sm:inline">View Clips</span>
                          <ChevronRight className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                        </div>
                      )}
                      
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          if (window.confirm('Are you sure you want to delete this video and all its clips? This action cannot be undone.')) {
                            try {
                              await deleteVideo(job.id);
                              setJobs(prev => prev.filter(j => j.id !== job.id));
                            } catch(err) {
                              alert(err.message || 'Failed to delete video');
                            }
                          }
                        }}
                        className="p-2 text-muted hover:text-red-500 hover:bg-red-500/15 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95"
                        title="Delete Video"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

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
