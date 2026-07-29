import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Clock, Scissors, ExternalLink, Plus, ChevronRight,
  CheckCircle2, Loader2, AlertCircle, Circle
} from 'lucide-react';
import RankBadge from '../components/RankBadge';

const STATUS_STEPS = ['queued', 'downloading', 'transcribing', 'ranking', 'analyzing', 'clipping', 'done'];

// Mock history data
const MOCK_HISTORY = [
  {
    id: 'job_1721900001',
    url: 'https://youtube.com/watch?v=abc123def',
    platform: 'YouTube',
    title: 'How I made $10k in 30 days with AI tools',
    submittedAt: '2026-07-29T10:22:00Z',
    status: 'done',
    clipCount: 9,
    topScore: 96,
    thumbnail: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=300&q=80',
  },
  {
    id: 'job_1721900002',
    url: 'https://www.instagram.com/reel/XYZ789/',
    platform: 'Instagram',
    title: 'Morning routine that changed my life',
    submittedAt: '2026-07-28T18:05:00Z',
    status: 'done',
    clipCount: 6,
    topScore: 88,
    thumbnail: 'https://images.unsplash.com/photo-1536240478700-b869ad10a2a0?w=300&q=80',
  },
  {
    id: 'job_1721900003',
    url: 'https://www.tiktok.com/@creator/video/9876',
    platform: 'TikTok',
    title: 'The secret nobody tells you about content creation',
    submittedAt: '2026-07-28T09:30:00Z',
    status: 'clipping',
    clipCount: null,
    topScore: null,
    thumbnail: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=300&q=80',
  },
  {
    id: 'job_1721900004',
    url: 'https://youtube.com/watch?v=qrs456tuv',
    platform: 'YouTube',
    title: 'Deep dive: Next.js 15 performance secrets',
    submittedAt: '2026-07-27T21:14:00Z',
    status: 'done',
    clipCount: 12,
    topScore: 91,
    thumbnail: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=300&q=80',
  },
  {
    id: 'job_1721900005',
    url: 'https://www.instagram.com/reel/LMN321/',
    platform: 'Instagram',
    title: 'Startup pitch that raised $2M in 48 hours',
    submittedAt: '2026-07-27T14:55:00Z',
    status: 'done',
    clipCount: 7,
    topScore: 84,
    thumbnail: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=300&q=80',
  },
];

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
  const now = new Date();
  const diff = now - d;
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return 'Yesterday';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function History() {
  const navigate = useNavigate();
  const [jobs] = useState(MOCK_HISTORY);

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
          {jobs.length === 0 ? (
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
                      <span className={`badge border text-[10px] ${PLATFORM_BG[job.platform] || 'bg-card text-muted border-border'}`}>
                        {job.platform}
                      </span>
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
